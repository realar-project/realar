import React from "react"
import { mount } from "enzyme";

import {
  event,
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

const backend_async_init = event();
const log = event();
const x10 = event();
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
  expression() {
    if (changed(this.proc)) backend_proc(this.proc);
  },
  constructor() {
    this.async_init();
  },
  async async_init() {
    await new Promise(r => setTimeout(r, 2000));
    backend_async_init();
  }
});

const user = unit({
  name: "not loaded",
  id: 0,
  get loading() {
    return this.load.proc > 0;
  },
  async load() {
    this.name = await GetUser(++this.id);
  },
  constructor() {
    this.async_constructor();
  },
  async async_constructor() {
    await backend_async_init;
    log("user", this.id, "backend_async_init");
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
  constructor() {},
  destructor() {},
  expression() {
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

function Root() {
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

test("should work", () => {
  const el = mount(<Root/>);
  expect(el.html()).toMatchSnapshot();

  let plus = el.find("button").at(5);
  expect(plus.text()).toBe("+");
  plus.simulate("click");

  expect(el.html()).toMatchSnapshot();
});
