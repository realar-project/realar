import React, { useState } from 'react';
import { mount } from 'enzyme';
import { useLocal, effect } from '../src';

test('should work useLocal function', () => {
  let constr = jest.fn();
  let spy = jest.fn();
  let inst, prev;

  class Unit {
    constructor(...args: any[]) {
      constr(...args);
      effect(() => spy);
    }
  }

  function A() {
    const [value, setValue] = useState(10);
    inst = useLocal(Unit, [value]);
    return <button onClick={() => setValue(20)} />;
  }

  const el = mount(<A />);

  expect(constr).toHaveBeenCalledTimes(1);
  expect(constr).toHaveBeenCalledWith(10);
  expect(spy).toBeCalledTimes(0);

  prev = inst;
  el.find('button').simulate('click');
  expect(inst).not.toBe(prev);

  prev = inst;
  el.find('button').simulate('click');
  expect(inst).toBe(prev);

  expect(constr).toHaveBeenCalledTimes(2);
  expect(constr).toHaveBeenLastCalledWith(20);
  expect(spy).toBeCalledTimes(1);
});

test('should throw exception if deps not an array', () => {
  class Unit {}

  expect(() => {
    useLocal(Unit, 1 as any);
  }).toThrow();
});
