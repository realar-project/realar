import React from "react"
import { mount } from "enzyme"

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
} from "..";

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

function Root() {
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

test("should work", () => {
  const el = mount(<Root/>);
  const click = (i) => el.find("button").at(i).simulate("click");
  const text = (i) => el.find("p").at(i).text();

  expect(text(0)).toBe("Current: 0");
  expect(text(1)).toBe("Next: 1");
  expect(text(2)).toBe("After: 2");
  click(0);
  expect(text(0)).toBe("Current: 1");
  expect(text(1)).toBe("Next: 2");
  expect(text(2)).toBe("After: 3");
});
