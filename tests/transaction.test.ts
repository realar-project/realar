import { value, cycle, transaction, signal, on } from '../src';

test('should work transaction', () => {
  const spy = jest.fn();
  const a = value(0);
  const b = value(0);

  on(() => a.val + b.val, sum => spy(sum));

  transaction(() => {
    a.val = 1;
    b.val = 1;
  });

  expect(spy).toBeCalledTimes(1);
  expect(spy).toBeCalledWith(2);
});

test('should work transaction.func', () => {
  const spy = jest.fn();
  const a = value(0);
  const b = value(0);

  on(() => a.val + b.val, sum => spy(sum));

  const fn = transaction.func(() => {
    a.val += 1;
    b.val += 1;
  });

  expect(spy).toBeCalledTimes(0);

  fn();
  expect(spy).toBeCalledTimes(1);
  expect(spy).toBeCalledWith(2);
  spy.mockReset();

  fn();
  expect(spy).toBeCalledTimes(1);
  expect(spy).toBeCalledWith(4);
});
