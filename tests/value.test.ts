import { sync, value } from '../src';

test('should work basic operations with value', () => {
  const spy = jest.fn();
  const a = value(10);
  const [get, set] = a;

  sync(() => a.val, spy);
  expect(spy).toHaveBeenNthCalledWith(1, 10);

  set(get() + 5);
  expect(spy).toHaveBeenNthCalledWith(2, 15, 10);

  a.val += 10;
  expect(spy).toHaveBeenNthCalledWith(3, 25, 15);

  a[1](a[0]() + a[0]());
  expect(spy).toHaveBeenNthCalledWith(4, 50, 25);

  a(1);
  expect(spy).toHaveBeenNthCalledWith(5, 1, 50);

  a(1);
  expect(spy).toHaveBeenCalledTimes(5);
});
