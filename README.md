# Realar

[![npm version](https://img.shields.io/npm/v/realar?style=flat-square)](https://www.npmjs.com/package/realar) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/realar@0.1.0?style=flat-square)](https://bundlephobia.com/result?p=realar@0.1.0)

### Installation

```bash
npm i -P realar
# or
yarn add realar
```

After that you need update your babel config:

```javascript
// .babelrc.js
module.exports = {
  "plugins": [
    "realar/babel"
  ]
}
```

And you need to wrap your react-dom render block, to realar `ready` function:

```javascript
import React from "react";
import { render } from "react-dom";
import { ready } from "realar";
import { App } from "./app";

ready(() => render(<App />, document.getElementById("root")));
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
  expression() {
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

Redux style usage :sunglasses:

```javascript
import React, { useCallback } from "react";
import { unit, useService, event } from "realar";

const add = event();
const toggle = event();

const store = unit({
  state: [
    { title: 'Todo 1' },
    { title: 'Todo 2', completed: true }
  ],
  get completed() {
    return this.state.filter(i => i.completed);
  },
  get all() {
    return this.state;
  },
  [add](title, completed = false) {
    this.state = [ ...this.state, { title, completed }];
  },
  [toggle](i) {
    const { state } = this;
    const index = state.indexOf(i);
    this.state = [
      ...state.slice(0, index),
      { ...i, completed: !i.completed },
      ...state.slice(index+1)
    ];
  }
});

function TodoItem({ item }) {
  const click = useCallback(() => toggle(item), [item]);
  const { title, completed } = item;

  return (
    <div className="todo-item" onClick={click}>
      {completed ? <div className="completed"></div> : null>}
      <span className="title">{title}</span>
    </div>
  );
}

function TodoList() {
  const { all } = useService(store);
  return (
    <div className="todo-list">
      {all.map(item => <TodoItem item={item} />)}
    </div>
  );
}

export default function App() {
  return <TodoList />;
}
```

Jest unit test usage :yum:

```javascript
import { mock } from "realar";
import { Notifier, Api, UserForm } from "./user-form";

test("User form should work", async () => {
  const notifierMock = mock(Notifier);
  const apiMock = mock(Api);

  const form = UserForm("a", "b");

  apiMock.userSave.mockResolvedValue(0);

  await form.save();
  expect(notifierMock.fail).toHaveBeenCalled();
  expect(apiMock.userSave).toHaveBeenCalledWith("a", "b");
});
```

And Your Jest config file

```javascript
// jest.config.json
{
  "setupFilesAfterEnv": [
    "realar/jest"
  ]
}
```

You can see full Jest unit test example on github [realar-project/realar-jest](https://github.com/realar-project/realar-jest).

---

And all interface methods in one presentation example :stuck_out_tongue_winking_eye:

```javascript
import React from "react";
import {
  call,
  changed,
  event,
  service,
  Service,
  signal,
  unit,
  useService,
  useUnit,
  Zone
} from "realar";

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
  proc: 0,
  get loading() {
    return this.proc > 0;
  },
  async load() {
    this.proc++;
    this.name = await GetUser(++this.id);
    this.proc--;
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

Try this example on your computer:

```bash
git clone git@github.com:betula/realar.git
cd realar
npm run start
# Open http://localhost:1210 in your browser
```
