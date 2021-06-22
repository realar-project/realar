import { signal, cycle } from '../src';

test('should work cycle manual stop', () => {
  const spy = jest.fn();
  const a = signal(0);
  const stop = cycle(() => {
    spy(a.val);
  });
  expect(spy).toHaveBeenCalledWith(0); spy.mockReset();
  a(1);
  expect(spy).toHaveBeenCalledWith(1); spy.mockReset();
  a(1);
  expect(spy).toHaveBeenCalledWith(1); spy.mockReset();
  stop();
  a(1);
  expect(spy).toBeCalledTimes(0);
});
