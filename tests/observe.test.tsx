import React, { FC, ForwardRefRenderFunction } from 'react';
import { mount } from 'enzyme';
import { use, box, observe } from '../src';

// Warning: forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).

type ForwardRefButtonProps = {
  data?: { value: string },
  onClick?: () => void
}
const ForwardRefButton: any = React.forwardRef<HTMLButtonElement, ForwardRefButtonProps>(observe((props: any, ref) => (
  <button ref={ref} onClick={props.onClick}>
    {props.data?.value}
  </button>
)) as any);

test('should support ref forwarding', () => {
  let node;

  class Data {
    @box value = '';
    add = () => this.value += 'a';
  }

  function A() {
    const data = use(Data);
    return <ForwardRefButton onClick={data.add} data={data} ref={(n: any) => node = n} />;
  }

  const el = mount(<A />);

  console.log(node);

  expect(el.find('button').text()).toBe('');
  el.find('button').simulate('click');
  expect(el.find('button').text()).toBe('a');
});
