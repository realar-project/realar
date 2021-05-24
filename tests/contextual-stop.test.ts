import { _cycle as cycle, _value as value, _contextual as contextual } from '../src';

test('should work stoppable stop method', () => {
  const spy = jest.fn();

  const a = value(0).pre.filter((v: number) => !(v % 2));
  a.to(spy);

  a(1);
  a(2);
  a(3);
  a(4);

  expect(spy).toHaveBeenNthCalledWith(1, 2, 0);
  expect(spy).toHaveBeenNthCalledWith(2, 4, 2);
});

test('should work stoppable in cycle not first iteration', () => {
  const spy = jest.fn();

  const a = value(1);
  a.to(spy);
  cycle(() => {
    a.val += a.val;
    if (a.val > 10) contextual.stop();
  });

  expect(spy).toHaveBeenNthCalledWith(4, 16, 8);
  expect(spy).toBeCalledTimes(4);
});

test('should work stoppable in cycle first iteration', () => {
  const spy = jest.fn();

  const a = value(1);
  a.to(spy);

  cycle(() => {
    contextual.stop();
    a.update(v => v + v);
  });

  expect(spy).toHaveBeenNthCalledWith(1, 2, 1);
  expect(spy).toBeCalledTimes(1);
});

test('should throw exception if run stoppable outside of stoppable context', () => {
  expect(() => {
    contextual.stop;
  }).toThrow('Parent context not found');
});
