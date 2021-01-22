import { shared, initial, free, effect } from '../src';

test('should work initial data with shared', () => {
  const spy = jest.fn();
  const destr = jest.fn();
  const a = { a: 10 };
  class A {
    constructor(data: typeof a) {
      spy(data);
      effect(() => destr);
    }
  }
  shared(A);
  expect(spy).toHaveBeenNthCalledWith(1, undefined);

  expect(destr).not.toBeCalled();
  free();
  expect(destr).toBeCalled();

  initial(a);
  shared(A);
  expect(spy).toHaveBeenNthCalledWith(2, a);
  expect(spy).toBeCalledTimes(2);
});

test('should work with arrow functions not only with class', () => {
  const spy = jest.fn().mockReturnValue(10);
  const A = (init: any) => spy(init);
  initial('initial');
  expect(shared(A)).toBe(10);
  expect(shared(A)).toBe(10);
  expect(spy).toHaveBeenCalledWith('initial');
  expect(spy).toBeCalledTimes(1);
});
