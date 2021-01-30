import React from 'react';
import { mount } from 'enzyme';
import { box, observe, useValue } from '../src';

test('should work useValue function', () => {
  const spy = jest.fn();
  const h = box(0);

  function A() {
    const val = useValue(h);
    spy(val);
    return <button onClick={() => h[1](20)} />;
  }

  const el = mount(<A />);

  expect(spy).toHaveBeenNthCalledWith(1, 0);

  el.find('button').simulate('click');
  expect(spy).toHaveBeenNthCalledWith(2, 20);

  el.find('button').simulate('click');
  expect(spy).toBeCalledTimes(2);
});

test('should work with observe together', () => {
  const spy = jest.fn();
  const h = box(0);

  const A = observe(() => {
    const val = useValue(h);
    spy(val);
    return <button onClick={() => h[1](20)} />;
  });

  const el = mount(<A />);

  expect(spy).toHaveBeenNthCalledWith(1, 0);

  el.find('button').simulate('click');
  expect(spy).toHaveBeenNthCalledWith(2, 20);

  el.find('button').simulate('click');
  expect(spy).toBeCalledTimes(2);
});
