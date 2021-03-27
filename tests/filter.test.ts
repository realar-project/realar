import { signal, on } from '../src';

test('should work basic operations with wrap filter method', async () => {
  const spy = jest.fn();

  const a = signal(0);
  const b = signal(0);

  const c = a.wrap.filter(() => b.val);

  on(c, spy);

  c(1);
  b(1);
  c(2);
  c(3);
  b(0);
  c(4);

  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy).toHaveBeenNthCalledWith(1, 2, 0);
  expect(spy).toHaveBeenNthCalledWith(2, 3, 2);
});

test('should work basic operations with flow filter method', async () => {
  const spy = jest.fn();

  const a = signal(0);
  const b = signal(0);

  const c = a.flow.filter(() => b.val);

  on(c, spy);

  a(1);
  b(1);
  a(2);
  a(3);
  b(0);
  a(4);

  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy).toHaveBeenNthCalledWith(1, 2, void 0);
  expect(spy).toHaveBeenNthCalledWith(2, 3, 2);
});
