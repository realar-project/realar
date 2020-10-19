import React from "react";
import { shared, unit, useShared, useOwn } from "realar";

const Stepper = unit({
  step: 1,
  inc() {
    this.step += 1;
  }
});

const Ticker = unit({
  stepper: shared(Stepper),
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
  constructor() {},
  destructor() {},
  expression() {
    this.after = this.next + this.step;
  }
});

export function App() {
  const { current, next, after, tick } = useOwn(Ticker);
  const { step, inc } = useShared(Stepper);
  return (
    <>
      <p>
        Current: {current} <button onClick={tick}>next</button>
      </p>
      <p>Next: {next}</p>
      <p>After: {after}</p>
      <p>
        Step: {step} <button onClick={inc}>inc</button>
      </p>
    </>
  )
}
