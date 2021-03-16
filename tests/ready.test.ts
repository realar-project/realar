import { on, ready } from '../src';
import { delay } from './lib';

test('should work ready with one value', async () => {
  const spy = jest.fn();
  const a = ready(0);
  on(a, spy);

  expect(a.val).toBe(0);

  const m = async () => {
    expect(await a).toBe(1);
  };
  const k = async () => {
    await delay(10);
    a(1);
  };
  await Promise.all([m(), k()]);

  a(2);
  expect(a.val).toBe(1);
  expect(await a).toBe(1);

  expect(spy).toBeCalledTimes(1);
  expect(spy).toBeCalledWith(1, 0);
});

test('should work ready with two values', async () => {
  const spy = jest.fn();
  const a = ready(0, 1);
  on(a, spy);

  expect(a.val).toBe(0);
  a();
  expect(a.val).toBe(1);
  expect(await a).toBe(1);

  expect(spy).toBeCalledTimes(1);
  expect(spy).toBeCalledWith(1, 0);
});

test('should work ready reset', async () => {
  const spy = jest.fn();
  const a = ready(0, 1);
  on(a, spy);

  expect(a.val).toBe(0);
  a()
  expect(a.val).toBe(1);
  a.reset();
  expect(a.val).toBe(0);

  const m = async () => {
    expect(await a).toBe(1);
  };
  const k = async () => {
    await delay(10);
    a();
  };
  await Promise.all([m(), k()]);

  expect(a.val).toBe(1);

  expect(spy).toBeCalledTimes(3);
  expect(spy).toHaveBeenNthCalledWith(1, 1, 0);
  expect(spy).toHaveBeenNthCalledWith(2, 0, 1);
  expect(spy).toHaveBeenNthCalledWith(3, 1, 0);
});
