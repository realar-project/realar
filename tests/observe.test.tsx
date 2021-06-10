import React from 'react';
import { mount } from 'enzyme';
import { useLocal, prop, observe, value } from '../src';

type ForwardRefButtonProps = {
  data?: { value: string };
  onClick?: () => void;
};
const ForwardRefButton = React.forwardRef<HTMLButtonElement, ForwardRefButtonProps>(
  observe.nomemo((props, ref) => (
    <button ref={ref} onClick={props.onClick}>
      {props.data?.value}
    </button>
  ))
);

test('should support ref forwarding', () => {
  let node;

  class Data {
    @prop value = '';
    add = () => (this.value += 'a');
  }

  function A() {
    const data = useLocal(Data);
    return <ForwardRefButton onClick={data.add} data={data} ref={(n: any) => (node = n)} />;
  }

  const el = mount(<A />);

  expect(node).toBeInstanceOf(HTMLButtonElement);
  expect(el.find('button').text()).toBe('');
  el.find('button').simulate('click');
  expect(el.find('button').text()).toBe('a');
});

const ValueSpot = ({ value }: any) => {
  return <b>{value.val}</b>
}

test('should support automatic jsx wrapping', () => {
  function A() {
    const logic = useLocal(() => {
      const store = value(0);
      const inc = () => store.val += 1;
      return { store, inc };
    });
    return <>
      <ValueSpot value={logic.store} />
      <button onClick={logic.inc} />
    </>
  }

  const el = mount(<A />);

  expect(el.find('b').text()).toBe('0');
  el.find('button').simulate('click');
  expect(el.find('b').text()).toBe('1');
  el.find('button').simulate('click');
  expect(el.find('b').text()).toBe('2');
});
