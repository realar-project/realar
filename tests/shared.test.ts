import { shared, initial, free, un, mock, unmock } from '../src';

test('should work initial data with shared', () => {
  const spy = jest.fn();
  const destr = jest.fn();
  const a = { a: 10 };
  class A {
    constructor(data: typeof a) {
      spy(data);
      un(destr);
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

test('should work mock and unmock', () => {
  const A = () => 10;
  expect(shared(A)).toBe(10);
  mock(A, 15);
  expect(shared(A)).toBe(15);
  unmock(A);
  expect(shared(A)).toBe(10);
});
