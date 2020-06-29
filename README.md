# Realar

[![npm version](https://img.shields.io/npm/v/realar?style=flat-square)](https://www.npmjs.com/package/realar) [![npm bundle size](https://badgen.net/bundlephobia/minzip/realar?style=flat-square)](https://bundlephobia.com/result?p=realar@0.0.1) [![build status](https://img.shields.io/github/workflow/status/betula/realar/Tests?style=flat-square)](https://github.com/betula/realar/actions?workflow=Tests) [![code coverage](https://img.shields.io/coveralls/github/betula/realar?style=flat-square)](https://coveralls.io/github/betula/realar)

### Installation

```bash
npm i --save realar
# or
yarn add realar
```

### Usage

Perfect usage :+1:

```javascript
import React from "react";
import { unit, useUnit } from "realar";

const Ticker = unit({
  current: 0,
  after: 2,
  get next() {
    return this.current + 1;
  },
  tick() {
    this.current += 1;
  },
  synchronize() {
    this.after = this.next + 1;
  }
});

export default function App() {
  const { current, next, after, tick } = useUnit(Ticker);
  return (
    <>
      <h1>Realar ticker</h1>
      <p>Current: {current}</p>
      <p>Next: {next}</p>
      <p>After: {after}</p>
      <p>
        <button onClick={tick}>tick</button>
      </p>
    </>
  );
}
```
Crazy usage :stuck_out_tongue_winking_eye:

```javascript
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
} from "realar";

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
    backend_proc(++this.proc);
    const res = await new Promise(r => setTimeout(() => r("John Doe " + id), 1000));
    backend_proc(--this.proc);
    return res;
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
  [counter](val) {
    this.current = val;
  },
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
```

Try this example on your computer

```bash
git clone git@github.com:betula/realar.git
cd realar
npm run start
# Open http://localhost:1234 in your browser
```
