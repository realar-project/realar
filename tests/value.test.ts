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

  a.set(a.get() + 7);
  expect(spy).toHaveBeenNthCalledWith(6, 8, 1);
});

test('should work value update', () => {
  const a = value(10);
  a.update(v => v + 3);
  expect(a.val).toBe(13);
});

test('should work value sub method', () => {
  const a = value(0);
  const b = value(0);
  const r = signal(0);
  a.sub(r, (a, r, r_prev) => (
    a * 100 + r * 10 + r_prev
  ));
  a.sub(() => b.val + 1, (a, r, r_prev) => (
    a * 100 + r * 10 + r_prev
  ));

  r(1);
  expect(a.val).toBe(10);
  b(1);
  expect(a.val).toBe(1021);
  r(1);
  expect(a.val).toBe(102111);
});

test('should work value sub once method', () => {
  const a = value(1);
  const r = signal(0);
  a.sub.once(r, (a, r, r_prev) => (
    a * 100 + r * 10 + r_prev
  ));
  r(5);
  r(6);

  expect(a.val).toBe(150);
});
