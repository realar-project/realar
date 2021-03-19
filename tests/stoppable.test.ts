import { cycle, stoppable, value } from '../src';

test('should work stoppable stop method', () => {
  const spy = jest.fn();

  const a = value(0).wrap((v: number) => {
    if (v % 2) stoppable().stop();
    return v;
  });
  a.watch(spy);

  a(1);
  a(2);
  a(3);
  a(4);

  expect(spy).toHaveBeenNthCalledWith(1, 2, 0);
  expect(spy).toHaveBeenNthCalledWith(2, 4, 2);
});

test('should work stoppable in cycle', () => {
  const spy = jest.fn();

  const a = value(1);
  a.watch(spy);

  cycle(() => {
    a.val += a.val;
    if (a.val > 10) stoppable().stop();
  });

  expect(spy).toHaveBeenNthCalledWith(4, 16, 8);
  expect(spy).toBeCalledTimes(4);
});

test('should throw exception if run stoppable outside of stoppable context', () => {
  expect(() => {
    stoppable();
  }).toThrow('Parent context not found');
});
