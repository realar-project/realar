import React, { useState } from "react";
import { mount } from "enzyme";
import { unit, useOwn } from "../lib";

test("should work unit arguments pass", () => {
  let constr = jest.fn();
  let destr = jest.fn();

  const u_f = unit({
    constructor(...args) {
      constr(...args);
    },
    destructor() {
      destr();
    }
  });

  function A() {
    const hook_descriptor = useState([]);
    let args = hook_descriptor[0];
    let set_args = hook_descriptor[1];

    useOwn(u_f, ...args);
    return (
      <button onClick={() => set_args([1, "hello", 5])} />
    )
  }

  const el = mount(<A/>);

  expect(constr).toHaveBeenCalledTimes(1);
  expect(constr).toHaveBeenCalledWith();

  el.find("button").simulate("click");
  el.find("button").simulate("click");

  // TODO: fix bug with non called constructor immediately after unlink
  // expect(destr).toHaveBeenCalledTimes(1);

  expect(constr).toHaveBeenCalledTimes(2);
  expect(constr).toHaveBeenLastCalledWith(1, "hello", 5);

  el.unmount();
  expect(destr).toHaveBeenCalledTimes(2);
});
