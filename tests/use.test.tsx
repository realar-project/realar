import React, { useState } from 'react';
import { mount } from 'enzyme';
import { use } from '../src';

test('should work use function', () => {
  let constr = jest.fn();
  let inst, prev;

  class Unit {
    constructor(...args: any[]) {
      constr(...args);
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

  prev = inst;
  el.find('button').simulate('click');
  expect(inst).not.toBe(prev);

  prev = inst;
  el.find('button').simulate('click');
  expect(inst).toBe(prev);

  expect(constr).toHaveBeenCalledTimes(2);
  expect(constr).toHaveBeenLastCalledWith(20);
});

test('should throw exception if deps not an array', () => {
  class Unit {}

  expect(() => {
    use(Unit, 1 as any);
  }).toThrowError('TypeError: deps argument should be an array');
});
