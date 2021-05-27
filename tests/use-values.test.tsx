import React from 'react';
import { mount } from 'enzyme';
import { value, observe, useValues } from '../src';

test('should work useValues function', () => {
  const spy = jest.fn();
  const a = value(0);
  const b = value(0);

  function A() {
    const val = useValues([a,b]);
    spy(val);
    return (
      <>
        <button onClick={() => a.set(20)} />
        <button onClick={() => b.set(2)} />
      </>
    );
  }

  const el = mount(<A />);

  expect(spy).toHaveBeenNthCalledWith(1, [0,0]);

  el.find('button').at(0).simulate('click');
  expect(spy).toHaveBeenNthCalledWith(2, [20,0]);

  el.find('button').at(0).simulate('click');
  expect(spy).toBeCalledTimes(2);

  el.find('button').at(1).simulate('click');
  expect(spy).toHaveBeenNthCalledWith(3, [20,2]);
});

test('should work with observe together', () => {
  const spy = jest.fn();
  const a = value(0);
  const b = value(0);

  const A = observe(() => {
    const val = useValues([a,b]);
    spy(val);
    return (
      <>
        <button onClick={() => a.set(20)} />
        <button onClick={() => b.set(2)} />
      </>
    );
  });

  const el = mount(<A />);

  expect(spy).toHaveBeenNthCalledWith(1, [0,0]);

  el.find('button').at(0).simulate('click');
  expect(spy).toHaveBeenNthCalledWith(2, [20,0]);

  el.find('button').at(0).simulate('click');
  expect(spy).toBeCalledTimes(2);

  el.find('button').at(1).simulate('click');
  expect(spy).toHaveBeenNthCalledWith(3, [20,2]);
});

test('should work with not a function', () => {
  const spy = jest.fn();
  const a = value(1);
  function A() {
    const val = useValues({a, ten: 10});
    spy(val);
    return <button />;
  }

  mount(<A />);
  expect(spy).toHaveBeenNthCalledWith(1, {a: 1, ten: 10});
});
