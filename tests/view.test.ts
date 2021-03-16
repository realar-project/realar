import { signal, stoppable, selector, on, value, transaction } from '../src';

test('should work basic operations with view methods for value', () => {
  const spy = jest.fn();
  const v = value(0);
  const v_1 = v.view((v) => v + v);

  on(v_1, spy);
  const commit = transaction();
  v(1);
  v_1.update(v => v + v);
  commit();
  expect(v_1.val).toBe(8)

  expect(spy).toBeCalledWith(8, 0);
});

test('should work basic operations with view methods for signal', () => {
  const spy = jest.fn();
  const v = signal(0);
  const v_1 = v.view((v) => v + v);

  on(v_1, spy);
  v(1);
  expect(v_1.val).toBe(2)

  expect(spy).toBeCalledWith(2, 0);
});

test('should work basic operations with view methods for selector', () => {
  const spy = jest.fn();
  const v = value(0);
  const k = v.select(v => v + v);
  const v_1 = k.view(v => v + v);

  on(v_1, spy);
  v(1);
  expect(v_1.val).toBe(4)

  expect(spy).toBeCalledWith(4, 0);
});
