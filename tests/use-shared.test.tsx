import React from 'react';
import { mount } from 'enzyme';
import { box, useShared, shared, action, on, sel, prop, observe } from '../src';

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

test('should work useShared with sel factory function', () => {
  const spy = jest.fn();
  const h = () => {
    const [get, set] = box(0);
    const inc = () => set(get() + 1);
    return sel(() => [
      get(),
      inc
    ] as [number, () => void]);
  };

  function A() {
    const [val, inc] = useShared(h);
    spy(val);
    return <button onClick={inc} />;
  }

  const el = mount(<A />);

  expect(spy).toHaveBeenNthCalledWith(1, 0);

  el.find('button').simulate('click');
  expect(spy).toHaveBeenNthCalledWith(2, 1);
  el.find('button').simulate('click');
  expect(spy).toHaveBeenNthCalledWith(3, 2);

  expect(shared(h)[0]()[0]).toBe(2);
});

test('should work useShared with class', () => {
  const spy = jest.fn();
  class H {
    @prop val = 0;
    inc = () => this.val += 1;
  }

  const A = observe(() => {
    const {val, inc} = useShared(H);
    spy(val);
    return <button onClick={inc} />;
  })

  const el = mount(<A />);

  expect(spy).toHaveBeenNthCalledWith(1, 0);

  el.find('button').simulate('click');
  expect(spy).toHaveBeenNthCalledWith(2, 1);
  el.find('button').simulate('click');
  expect(spy).toHaveBeenNthCalledWith(3, 2);

  expect(shared(H).val).toBe(2);
});
