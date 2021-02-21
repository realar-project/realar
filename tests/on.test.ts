import { prop, cache, on, value } from '../src';

test('should work basic operations with prop, cache and on', () => {
  const spy = jest.fn();
  class A {
    @prop a = 10;
    @cache get b() {
      return this.a + 1;
    }
  }
  const a = new A();
  on(() => a.b, spy);
  expect(spy).toBeCalledTimes(0);

  a.a += 10;
  expect(spy).toHaveBeenNthCalledWith(1, 21, 11);
  expect(spy).toBeCalledTimes(1);
});

test('should cache return value in on', () => {
  const spy = jest.fn();
  const a = value(0);

  on(() => Math.floor(a[0]() / 2), spy);

  a[1](1);
  expect(spy).toBeCalledTimes(0);

  a[1](2);
  expect(spy).toHaveBeenNthCalledWith(1, 1, 0);
});

test('should work on stop', () => {
  const spy = jest.fn();
  const a = value(0);

  const stop = on(() => a.val, spy);

  a.val = 1;
  expect(spy).toHaveBeenNthCalledWith(1, 1, 0);
  stop();
  a.val = 2;
  expect(spy).toBeCalledTimes(1);
});
