import React, { useState } from "react"
import { mount } from "enzyme";

import {
  unit,
  useUnit
} from "../lib";


test("should work unit arguments pass", () => {
  let constr = jest.fn();
  let destr = jest.fn();
  let set_args;

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
    args = hook_descriptor[0];
    set_args = hook_descriptor[1];

    const u = useUnit(u_f, ...args);
    return null;
  }


  const el = mount(<A/>);

  expect(constr).toHaveBeenCalledTimes(0);
  expect(constr).toHaveBeenCalledWith();

});
