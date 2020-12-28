import { shared, free } from '../src';

test('should run instance free method on free call', () => {
  const spy = jest.fn();
  class A {
    free = spy;
  }

  shared(A);
  free();
  expect(spy).toBeCalled();
});
