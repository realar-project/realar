import React, { useState } from 'react';
import { mount } from 'enzyme';
import { value, useJsx } from '../src';

test('should work useJsx with no deps', () => {
  const a = value(0);
  const b = value(0);

  function A(props) {
    const Body = useJsx<{ value: string }>(({ children, value }) => (
      <>
        <i>{a.val}</i>
        <i>{b.val}</i>
        <i>{value}</i>
        {children}
      </>
    ));
    return (
      <Body value={props.value}>
        <button onClick={() => a.set(20)} />
        <button onClick={() => b.set(2)} />
      </Body>
    );
  }

  const el = mount(<A value="11" />);

  expect(el.find('i').at(0).text()).toBe('0');
  expect(el.find('i').at(1).text()).toBe('0');
  expect(el.find('i').at(2).text()).toBe('11');

  el.find('button').at(0).simulate('click');
  expect(el.find('i').at(0).text()).toBe('20');
  expect(el.find('i').at(1).text()).toBe('0');
  expect(el.find('i').at(2).text()).toBe('11');

  el.find('button').at(1).simulate('click');
  expect(el.find('i').at(0).text()).toBe('20');
  expect(el.find('i').at(1).text()).toBe('2');
  expect(el.find('i').at(2).text()).toBe('11');
});


test('should work useJsx with deps', () => {
  const a = value(0);
  const b = value(0);

  function A() {
    const s1 = useState(5);
    const s2 = useState(5);

    const Body = useJsx(({ children }) => (
      <>
        <i>{a.val}</i>
        <i>{b.val}</i>
        <i>{s1[0]}</i>
        {children}
      </>
    ), [s2[0]]);
    return (
      <Body>
        <button onClick={() => a.set(20)} />
        <button onClick={() => b.set(2)} />
        <button onClick={() => s1[1](10)} />
        <button onClick={() => s2[1](10)} />
      </Body>
    );
  }

  const el = mount(<A />);

  expect(el.find('i').at(2).text()).toBe('5');
  el.find('button').at(2).simulate('click');

  expect(el.find('i').at(0).text()).toBe('0');
  expect(el.find('i').at(1).text()).toBe('0');
  expect(el.find('i').at(2).text()).toBe('5');

  el.find('button').at(0).simulate('click');
  expect(el.find('i').at(0).text()).toBe('20');
  expect(el.find('i').at(1).text()).toBe('0');
  expect(el.find('i').at(2).text()).toBe('5');

  el.find('button').at(1).simulate('click');
  expect(el.find('i').at(0).text()).toBe('20');
  expect(el.find('i').at(1).text()).toBe('2');
  expect(el.find('i').at(2).text()).toBe('5');

  el.find('button').at(3).simulate('click');
  expect(el.find('i').at(0).text()).toBe('20');
  expect(el.find('i').at(1).text()).toBe('2');
  expect(el.find('i').at(2).text()).toBe('10');
});
