import React, { useState } from 'react';
import { mount } from 'enzyme';
import { useLocal, local, useScoped, Scope } from '../src';

test('should work local.inject in useLocal function', () => {
  let spy = jest.fn();

  const unit = (value: number) => {
    local.inject(() => {
      const [a, set_a] = useState(0);
      if (value !== a) set_a(value);
      spy(a);
    });
  };

  function A() {
    const [v, set_v] = useState(10);
    useLocal(unit, [Math.floor(v / 2)]);
    return <button onClick={() => set_v(v => v + 1)} />;
  }

  const el = mount(<A />);
  const click = () => el.find('button').simulate('click');

  expect(spy).toHaveBeenNthCalledWith(1, 0);
  expect(spy).toHaveBeenNthCalledWith(2, 5);
  expect(spy).toBeCalledTimes(2);
  click();
  expect(spy).toHaveBeenNthCalledWith(3, 5);
  expect(spy).toBeCalledTimes(3);
  click();
  expect(spy).toHaveBeenNthCalledWith(4, 5);
  expect(spy).toHaveBeenNthCalledWith(5, 6);
  expect(spy).toBeCalledTimes(5);
});

test('should throw exception if not in context', () => {
  expect(() => {
    local.inject(() => {});
  }).toThrow('The local.inject section available only in useLocal');
});

test('should throw exception if not useLocal', () => {
  const _error = console.error;
  console.error = () => {};
  expect(() => {
    const unit = () => {
      local.inject(() => {});
    };
    function A() {
      useScoped(unit);
      return null;
    }
    mount(
      <Scope>
        <A />
      </Scope>
    );
  }).toThrow('The local.inject section available only in useLocal');
  console.error = _error;
});
