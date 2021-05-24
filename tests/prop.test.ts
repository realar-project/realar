import { prop, _on as on } from '../src';

test('should work prop decorator with first set', () => {
  const spy = jest.fn();
  class A {
    @prop b = 0;
  }
  const a = new A();
  a.b = 10;
  on(() => a.b, spy);
  a.b = 11;
  expect(spy).toHaveBeenNthCalledWith(1, 11, 10);
  expect(spy).toBeCalledTimes(1);
});
