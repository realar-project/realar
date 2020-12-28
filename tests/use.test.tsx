import React, { useState } from 'react';
import { mount } from 'enzyme';
import { use } from '../src';

test('should work use function', () => {
  let constr = jest.fn();
  let free = jest.fn();
  let effect = jest.fn();
  let effect_unlink = jest.fn();
  let inst, prev;

  class Unit {
    constructor(...args) {
      constr(...args);
    }
    free() {
      free();
    }
    effect() {
      effect();
      return effect_unlink;
    }
  }

  function A() {
    const [value, setValue] = useState(10);
    inst = use(Unit, [value]);
    return <button onClick={() => setValue(20)} />;
  }

  const el = mount(<A />);

  expect(constr).toHaveBeenCalledTimes(1);
  expect(constr).toHaveBeenCalledWith(10);

  expect(effect).toHaveBeenCalledTimes(1);
  expect(effect).toHaveBeenCalledWith();

  prev = inst;
  el.find('button').simulate('click');
  expect(inst).not.toBe(prev);

  prev = inst;
  el.find('button').simulate('click');
  expect(inst).toBe(prev);

  expect(free).toHaveBeenCalledTimes(1);
  expect(effect_unlink).toHaveBeenCalledTimes(1);

  expect(constr).toHaveBeenCalledTimes(2);
  expect(constr).toHaveBeenLastCalledWith(20);

  el.unmount();
  expect(free).toHaveBeenCalledTimes(2);
  expect(effect_unlink).toHaveBeenCalledTimes(2);
});

test('should throw exception if deps not an array', () => {
  class Unit {}

  expect(() => {
    use(Unit, 1 as any);
  }).toThrowError('TypeError: deps argument should be an array');
});
