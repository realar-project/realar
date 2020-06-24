# Realar

[![npm version](https://img.shields.io/npm/v/realar?style=flat-square)](https://www.npmjs.com/package/realar) [![npm bundle size](https://badgen.net/bundlephobia/minzip/realar@0.0.1?style=flat-square)](https://bundlephobia.com/result?p=realar@0.0.1) [![build status](https://img.shields.io/github/workflow/status/betula/realar/Tests?style=flat-square)](https://github.com/betula/realar/actions?workflow=Tests) [![code coverage](https://img.shields.io/coveralls/github/betula/realar?style=flat-square)](https://coveralls.io/github/betula/realar)

Perfect usage :+1: [on codesandbox](https://codesandbox.io/s/black-wood-t4533)

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
Crazy usage :stuck_out_tongue_winking_eye: [on codesandbox](https://codesandbox.io/s/ecstatic-field-q1due)

```javascript
import React from "react";
import {
  unit,
  useService,
  changed,
  service,
  action,
  inst,
  chan,
  useUnit,
  Zone,
  Service
} from "realar";

const MaxBoost = action();
const GetUser = chan();

const Config = unit({
  step: 1,
  inc() {
    this.step += 1;
  },
  [MaxBoost]() {
    console.log("x10 speed!", this.step);
    this.step *= 10;
  }
});

const Ticker = unit({
  config: service(Config),
  om: inst(Config),
  after: 0,
  current: 0,
  get next() {
    return this.current + this.step;
  },
  get step() {
    return this.config.step;
  },
  tick() {
    this.current += this.step;
  },
  construct() {},
  destruct() {},
  synchronize() {
    this.after = this.next + this.step;
    if (changed(this.after > 4)) console.log("Fire!");
    if (changed(this.after > 10)) {
      MaxBoost();
    }
  }
});

const BackendFF = unit({
  async [GetUser](id) {
    return await new Promise(r => setTimeout(() => r("John Doe " + id), 1000));
  }
});

const User = unit({
  user: "not loaded",
  concurrent: 0,
  get loading() {
    return this.concurrent > 0;
  },
  async load() {
    this.concurrent++;
    this.user = await GetUser(1);
    this.concurrent--;
  }
});

function App() {
  const { current, next, tick, step } = useService(Ticker);
  const {
    after,
    config: { inc },
    om: { step: om_step }
  } = useService(Ticker);
  const { user, load, loading } = useUnit(User);
  return (
    <div>
      <h1>Realar ticker</h1>
      <p>Current: {current}</p>
      <p>Next: {next}</p>
      <p>After: {after}</p>
      <button onClick={tick}>tick</button>
      <p>Step: {step}</p>
      <button onClick={inc}>inc</button>
      <p>Om: {om_step}</p>
      <p>User: {loading ? "loading..." : user}</p>
      <button onClick={load}>load</button>
      <Service unit={BackendFF} root />
    </div>
  );
}

export default function Root() {
  return (
    <>
      <Zone>
        <App />
      </Zone>
      <Zone>
        <App />
      </Zone>
    </>
  );
}
```

### Install

```bash
npm i --save realar
# or
yarn add realar
```
