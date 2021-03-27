import { signal, on } from '../src';

test('should work basic operations with filter method', async () => {
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
