import { on, signal, sync, value } from '../../src';
import { delay } from '../lib';

test('should work signal.trigger with one value', async () => {
  const spy = jest.fn();
  const a = signal.trigger(0);
  on(a, spy);

  expect(a.val).toBe(0);

  const m = async () => {
    expect(await a.promise).toBe(1);
  };
  const k = async () => {
    await delay(10);
    a(1);
  };
  await Promise.all([m(), k()]);

  a(2);
  expect(a.val).toBe(1);
  expect(await a.promise).toBe(1);

  expect(spy).toBeCalledTimes(1);
  expect(spy).toBeCalledWith(1, 0);
});

test('should work signal.trigger with configured .pre', async () => {
  const spy = jest.fn();
  const a = signal.trigger(0).pre(() => 1);
  on(a, spy);

  expect(a.val).toBe(0);
  a();
  expect(a.val).toBe(1);
  expect(await a.promise).toBe(1);

  expect(spy).toBeCalledTimes(1);
  expect(spy).toBeCalledWith(1, 0);
});

test('should work signal.trigger reset', async () => {
  const spy = jest.fn();
  const a = signal.trigger(0).pre(() => 1);
  on(a, spy);

  expect(a.val).toBe(0);
  a();
  expect(a.val).toBe(1);
  a.reset();
  expect(a.val).toBe(0);

  const m = async () => {
    expect(await a.promise).toBe(1);
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

test('should work signal.trigger wrapped', async () => {
  const spy = jest.fn();
  const a = signal.trigger(0)
    .pre((v: number) => v * 2)
    .pre(() => 10);
  on(a, spy);

  expect(a.val).toBe(0);
  a();
  expect(a.val).toBe(20);
  a.reset();
  expect(a.val).toBe(0);

  const m = async () => {
    expect(await a.promise).toBe(20);
  };
  const k = async () => {
    await delay(10);
    a();
  };
  await Promise.all([m(), k()]);

  expect(a.val).toBe(20);

  expect(spy).toBeCalledTimes(3);
  expect(spy).toHaveBeenNthCalledWith(1, 20, 0);
  expect(spy).toHaveBeenNthCalledWith(2, 0, 20);
  expect(spy).toHaveBeenNthCalledWith(3, 20, 0);
});

test('should work signal.trigger resolved', async () => {
  const r = signal.trigger.resolved(1);
  expect(r.val).toBe(1);
  expect(await r.promise).toBe(1);
});

test('should work signal.trigger with undefined resolved', async () => {
  const r = signal.trigger.resolved();
  expect(r.val).toBe(void 0);
  expect(await r.promise).toBe(void 0);
});
