import React from 'react';
import { mount } from 'enzyme';
import { box, useShared, shared, action, on } from '../src';

test('should work useShared function', () => {
  const spy = jest.fn();
  const inc = action<number>();
  const h = () => {
    const [get, set] = box(0);
    on(inc, () => set(get() + 1));
    return get;
  };

  function A() {
    const val = useShared(h);
    spy(val);
    return <button onClick={inc} />;
  }

  const el = mount(<A />);

  expect(spy).toHaveBeenNthCalledWith(1, 0);

  el.find('button').simulate('click');
  expect(spy).toHaveBeenNthCalledWith(2, 1);
  el.find('button').simulate('click');
  expect(spy).toHaveBeenNthCalledWith(3, 2);

  expect(shared(h)()).toBe(2);
});
