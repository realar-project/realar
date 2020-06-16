import React from 'react'
import { mount } from 'enzyme'
import { useService } from '../src'

test('Should work', () => {
  class Counter {
    count = 0;
    inc() { this.count += 1; }
    dec() { this.count -= 1; }
  }

  const App = () => {
    const { count, inc, dec } = useService(Counter);
    return (
      <>
        <i>{count}</i>
        <button onClick={inc}>+</button>
        <button onClick={dec}>-</button>
      </>
    )
  }

  const el = mount(<App/>)
  expect(el.find('i').text()).toBe('0')
  el.find('button').at(0).simulate('click')
  expect(el.find('i').text()).toBe('1')
  el.find('button').at(1).simulate('click')
  expect(el.find('i').text()).toBe('0')
});
