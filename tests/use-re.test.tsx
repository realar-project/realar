import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { re, useRe, write } from '../src';

describe('should work', () => {

  test('useRe', () => {
    const spy = jest.fn();
    const h = re(0);

    function A() {
      const val = useRe(h);
      spy(val);
      return <button onClick={() => write(h, 20)} />;
    }

    render(<A />);
    expect(spy).toBeCalledWith(0); spy.mockReset();

    fireEvent.click(screen.getByRole('button'));
    expect(spy).toBeCalledWith(20); spy.mockReset();

    fireEvent.click(screen.getByRole('button'));
    expect(spy).toBeCalledTimes(0);
  });

});
