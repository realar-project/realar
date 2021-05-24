import { prop, cache, _sync as sync, _value as value } from '../src';

test('should work basic operations with prop, cache and sync', () => {
  const spy = jest.fn();
  class A {
    @prop a = 10;
    @cache get b() {
      return this.a + 1;
    }
  }
  const a = new A();
  sync(() => a.b, spy);
  expect(spy).toBeCalledTimes(1);
  expect(spy).toHaveBeenNthCalledWith(1, 11, void 0);

  a.a += 10;
  expect(spy).toHaveBeenNthCalledWith(2, 21, 11);
  expect(spy).toBeCalledTimes(2);
});

test('should cache return value in sync', () => {
  const spy = jest.fn();
  const a = value(0);

  sync(() => Math.floor(a.val / 2), spy);
  expect(spy).toBeCalledTimes(1);
  expect(spy).toHaveBeenNthCalledWith(1, 0, void 0);

  a.set(1);
  a.set(2);
  expect(spy).toHaveBeenNthCalledWith(2, 1, 0);
  expect(spy).toBeCalledTimes(2);
});
