import { action, cycle } from '../src';

test('should work action in cycle', () => {
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

test('should work action as promise', async () => {
  const spy = jest.fn();

  const a = action<number>();
  const fn = async () => {
    spy(await a);
  };
  fn();
  expect(spy).toBeCalledTimes(0);
  a(10);
  await new Promise(resolve => setTimeout(resolve, 10));
  expect(spy).toHaveBeenNthCalledWith(1, 10);
  expect(spy).toBeCalledTimes(1);
  fn();
  expect(spy).toBeCalledTimes(1);
  a(10);
  await new Promise(resolve => setTimeout(resolve, 10));
  expect(spy).toBeCalledTimes(2);
  expect(spy).toHaveBeenNthCalledWith(2, 10);
});
