import { on, boxProperties } from '../src';

test('should work box properties', () => {
  const spy = jest.fn();
  const m = boxProperties({
    a: 1,
    b: 2
  });

  on(() => [m.a, m.b], spy);

  m.a = 3;
  expect(spy).toHaveBeenNthCalledWith(1, [3, 2], [1, 2]);
  m.b = 1;
  expect(spy).toHaveBeenNthCalledWith(2, [3, 1], [3, 2]);
  m.b = 1;
  expect(spy).toBeCalledTimes(2);
});
