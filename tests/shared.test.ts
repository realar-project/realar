import { shared, initial, free } from '../src';

test('should work initial data with shared', () => {
  const spy = jest.fn();
  const a = { a: 10 };
  class A {
    constructor(data: typeof a) {
      spy(data);
    }
  }

  shared(A);
  expect(spy).toHaveBeenNthCalledWith(1, undefined);
  free();
  initial(a);
  shared(A);
  expect(spy).toHaveBeenNthCalledWith(2, a);

  expect(spy).toBeCalledTimes(2);
});
