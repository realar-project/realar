import React from 'react';
import { mount } from 'enzyme';
import { useShared, shared, prop, observe } from '../src';

test('should work useShared with class', () => {
  const spy = jest.fn();
  class H {
    @prop val = 0;
    inc = () => (this.val += 1);
  }

  const A = observe(() => {
    const { val, inc } = useShared(H);
    spy(val);
    return <button onClick={inc} />;
  });

  const el = mount(<A />);

  expect(spy).toHaveBeenNthCalledWith(1, 0);

  el.find('button').simulate('click');
  expect(spy).toHaveBeenNthCalledWith(2, 1);
  el.find('button').simulate('click');
  expect(spy).toHaveBeenNthCalledWith(3, 2);

  expect(shared(H).val).toBe(2);
});
