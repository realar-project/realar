import React from "react";
import {
  action,
  call,
  changed,
  service,
  Service,
  signal,
  unit,
  useService,
  useUnit,
  Zone
} from "../lib";

const log = action();
const x10 = action();
const GetUser = call();
const counter = signal(-1);
const backend_proc = signal(0);

const logger = unit({
  lines: [],
  get text() {
    return this.lines.join("\n");
  },
  [log](...args) {
    this.lines = [...this.lines, args.join(" ")];
  }
});

const backend = unit({
  proc: 0,
  async [GetUser](id) {
    this.proc++;
    const res = await new Promise(r => setTimeout(() => r("John Doe " + id), 1000));
    this.proc--;
    return res;
  },
  synchronize() {
    if (changed(this.proc)) backend_proc(this.proc);
  }
});

const user = unit({
  name: "not loaded",
  id: 0,
  proc: 0,
  get loading() {
    return this.proc > 0;
  },
  async load() {
    this.proc++;
    this.name = await GetUser(++this.id);
    this.proc--;
  }
});

const stepper = unit({
  step: 1,
  inc() {
    this.step += 1;
  },
  [x10]() {
    log("step:", this.step, "->", this.step * 10);
    this.step *= 10;
  }
});

const ticker = unit({
  user: user(),
  backend_proc: 0,
  stepper: service(stepper),
  after: 0,
  current: 0,
  get step() {
    return this.stepper.step;
  },
  get next() {
    return this.current + this.step;
  },
  tick() {
    this.current += this.step;
  },
  save: () => counter(this.current),
  construct() {},
  destruct() {},
  synchronize() {
    this.after = this.next + this.step;
    if (changed(this.after > 5)) {
      log("if after > 5");
      x10();
    }
  },
  [counter]: val => (this.current = val),
  [backend_proc](val) {
    this.backend_proc = val;
  }
});

function App() {
  const { current, next, after, tick, user, save, backend_proc } = useUnit(ticker);
  const { step, inc } = useService(stepper);
  const { load, loading, name } = user;
  return (
    <div>
      <p>
        Current: {current}
        <button onClick={tick}>next</button>
        <button onClick={save}>save</button>
      </p>
      <p>Next: {next}</p>
      <p>After: {after}</p>
      <p>
        Step: {step}
        <button onClick={inc}>inc</button>
      </p>
      <p>User: {loading ? "loading..." : name}</p>
      <p>Backend: {backend_proc ? "loading..." : "idle"}</p>
      <p><button onClick={load}>load</button></p>
    </div>
  )
}

function Logger() {
  const { text } = useService(logger);
  return (
    <textarea value={text} readOnly />
  )
}

const whirl = unit({
  cols: [1],
  map: fn => this.cols.map(fn),
  shift() {
    this.cols = this.cols.slice(1);
  },
  push() {
    this.cols = [...this.cols, (this.cols.pop() || 0) + 1];
  }
});

function Whirl({ children }) {
  const { map, shift, push } = useUnit(whirl);
  return (
    <>
      <button onClick={shift}>-</button>
      {map(key => (
        <Zone key={key}>
          {children}
        </Zone>
      ))}
      <button onClick={push}>+</button>
    </>
  )
}

export function Root() {
  return (
    <>
      <Whirl>
        <App />
      </Whirl>
      <Logger />
      <Service unit={backend}/>
    </>
  );
}
