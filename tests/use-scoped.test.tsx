import React from 'react';
import { mount } from 'enzyme';
import { useScoped, Scope, effect } from '../src';

test('should work useScoped function', async () => {
  let up = jest.fn();
  let down = jest.fn();

  const unit = () => {
    effect(() => {
      up();
      return () => down();
    });
  };

  function A() {
    useScoped(unit);
    return <a />;
  }

  const el = mount(
    <Scope>
      <A />
      <A />
      <Scope>
        <A />
      </Scope>
      <Scope>
        <A />
        <A />
      </Scope>
    </Scope>
  );

  expect(up).toHaveBeenCalledTimes(3);

  el.unmount();
  await new Promise(r => setTimeout(r));
  expect(down).toHaveBeenCalledTimes(3);
});

test('should throw exception if used without parent component', () => {
  const unit = () => {};
  function A() {
    useScoped(unit);
    return <a />;
  }

  jest.spyOn(console, 'error').mockImplementation(() => {});
  expect(() => {
    mount(<A />);
  }).toThrow();
});
