import { value, cycle, untrack, signal } from '../src';

test('should work untrack', () => {
  const spy = jest.fn();
  const v = value(0);

  cycle(() => {
    spy(untrack(v.get))
  })

  expect(spy).toBeCalledWith(0); spy.mockReset();
  v(1);
  expect(spy).toBeCalledTimes(0);
});

test('should work untrack.func', () => {
  const spy = jest.fn();
  const v = signal(0);

  cycle(untrack.func(() => {
    spy(v.get())
  }))

  expect(spy).toBeCalledWith(0); spy.mockReset();
  v(1);
  expect(spy).toBeCalledTimes(0);
});
