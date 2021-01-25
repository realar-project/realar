import { prop, cache, on } from '../src';

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
