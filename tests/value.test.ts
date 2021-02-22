import { sync, value, signal } from '../src';

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

test('should work value update', () => {
  const a = value(10);
  a.update(v => v + 3);
  expect(a.val).toBe(13);
});

test('should work value on', () => {
  const a = value(10);
  const s = signal(0);

  a.on(s, (v, k) => v + k);
  expect(a.val).toBe(10);
  s(5);
  expect(a.val).toBe(15);
});
