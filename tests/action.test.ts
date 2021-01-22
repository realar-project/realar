import { action, cycle } from '../src';

test('should work action', () => {
  const spy = jest.fn();

  const a = action<number>();
  cycle(() => {
    const [data, fired] = a[0]();
    spy(data, fired);
  });

  expect(spy).toHaveBeenNthCalledWith(1, void 0, false);
  a(10);
  expect(spy).toHaveBeenNthCalledWith(2, 10, true);
  expect(spy).toBeCalledTimes(2);
  a(10);
  expect(spy).toHaveBeenNthCalledWith(3, 10, true);
  expect(spy).toBeCalledTimes(3);
});
