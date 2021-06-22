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

test('should work signal.trigger from value', async () => {
  const spy = jest.fn();

  const s = value(1);
  const r = signal.trigger.from(s);

  sync(r, spy);

  s(1);
  s(2);
  s(3);

  expect(spy).toBeCalledTimes(2);
  expect(spy).toHaveBeenNthCalledWith(1, 1, void 0);
  expect(spy).toHaveBeenNthCalledWith(2, 2, 1);
});

test('should work signal.trigger from signal', async () => {
  const spy = jest.fn();

  const s = signal(1);
  const r = signal.trigger.from(s);

  sync(r, spy);

  s(1);
  s(3);

  expect(spy).toBeCalledTimes(2);
  expect(spy).toHaveBeenNthCalledWith(1, 1, void 0);
  expect(spy).toHaveBeenNthCalledWith(2, 1, 1);
});

test('should work reset with signal.trigger from signal', async () => {
  const spy = jest.fn();

  const s = signal(1);
  const r = signal.trigger.from(s);

  expect(r.val).toBe(1);
  sync(r, spy);

  s(1);
  s(3);

  let k;
  expect(await (k = r.promise)).toBe(1);

  expect(spy).toBeCalledTimes(2);
  expect(spy).toHaveBeenNthCalledWith(1, 1, void 0);
  expect(spy).toHaveBeenNthCalledWith(2, 1, 1);
  spy.mockReset();

  r.reset();
  expect(r.promise).not.toBe(k);
  expect(r.val).toBe(3);

  s(1);
  s(3);

  expect(await r.promise).toBe(1);

  expect(r.val).toBe(1);
  expect(spy).toBeCalledTimes(2);
  expect(spy).toHaveBeenNthCalledWith(1, 3, 1);
  expect(spy).toHaveBeenNthCalledWith(2, 1, 3);
});

test('should work signal.trigger.flag from expression', async () => {
  const spy = jest.fn();

  const v = value(0);
  const r = signal.trigger.flag.from(() => v.val as any);

  sync(r, spy);

  v(1);
  v(0);

  expect(spy).toBeCalledTimes(2);
  expect(spy).toHaveBeenNthCalledWith(1, false, void 0);
  expect(spy).toHaveBeenNthCalledWith(2, true, false);
});

test('should work reset with signal.trigger.flag from expression', async () => {
  const spy = jest.fn();

  const v = value(0);
  const r = signal.trigger.flag.from(() => v.val as any);

  sync(r, spy);

  v(1);
  v(0);

  expect(spy).toBeCalledTimes(2);
  expect(spy).toHaveBeenNthCalledWith(1, false, void 0);
  expect(spy).toHaveBeenNthCalledWith(2, true, false);

  r.reset();
  expect(r.val).toBe(false);
  v(1);
  expect(r.val).toBe(true);
  r.reset();
  expect(r.val).toBe(true);

  v.reset();
  expect(r.val).toBe(false);

  expect(await r.promise).toBe(false);
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
