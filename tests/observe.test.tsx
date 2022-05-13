import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, fireEvent, screen } from '@testing-library/react';
import { re, read, write, update, observe } from '../src';

type ForwardRefButtonProps = {
  r: any;
  onClick: () => void;
};
const ForwardRefButton = React.forwardRef<HTMLButtonElement, ForwardRefButtonProps>(
  observe.nomemo((props, ref) => (
    <button ref={ref} onClick={props.onClick}>
      {read(props.r)}
    </button>
  ))
);

describe('should work', () => {

  test('observe', () => {
    const spy = jest.fn();
    const h = re(0);

    const A = observe(() => {
      spy(read(h));
      return <button onClick={() => write(h, 20)} />;
    });

    render(<A />);
    expect(spy).toBeCalledWith(0); spy.mockReset();

    fireEvent.click(screen.getByRole('button'));
    expect(spy).toBeCalledWith(20); spy.mockReset();

    fireEvent.click(screen.getByRole('button'));
    expect(spy).toBeCalledTimes(0);
  });

  test('observe with ref forwarding', () => {
    let node;

    const r = re('');
    const add = () => update(r, (v) => v + 'a');

    function A() {
      return <ForwardRefButton onClick={add} r={r} ref={(n: any) => (node = n)} />;
    }

    render(<A />);

    expect(node).toBeInstanceOf(HTMLButtonElement);

    expect(screen.getByRole('button').textContent).toBe('');
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button').textContent).toBe('a');
  });

  test('observe memo', () => {
    const spy = jest.fn();

    const a = re(0);
    const b = re(0);

    const B = observe(() => (spy(), <i>{read(b)}</i>));
    const A = observe(() => <><b>{read(a)}</b><B /></>);

    render(<A />);

    expect(spy).toBeCalledTimes(1); spy.mockReset();

    act(() => write(a, 1));
    expect(spy).toBeCalledTimes(0);
    act(() => write(b, 1));
    expect(spy).toBeCalledTimes(1); spy.mockReset();
    act(() => write(b, 2));
    expect(spy).toBeCalledTimes(1); spy.mockReset();
    act(() => write(a, 2));
    expect(spy).toBeCalledTimes(0);
  });

});
