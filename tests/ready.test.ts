import { on, ready, signal, sync, value } from '../src';
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
  const a = signal.ready(0).to(1);
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
  const a = ready(0).to(1);
  on(a, spy);

  expect(a.val).toBe(0);
  a();
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

test('should work ready wrapped to', async () => {
  const spy = jest.fn();
  const a = ready(0)
    .wrap((v: number) => v * 2)
    .to(10);
  on(a, spy);

  expect(a.val).toBe(0);
  a();
  expect(a.val).toBe(20);
  a.reset();
  expect(a.val).toBe(0);

  const m = async () => {
    expect(await a).toBe(20);
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

test('should work ready from value', async () => {
  const spy = jest.fn();

  const s = value(1);
  const r = ready.from(s);

  sync(r, spy);

  s(1);
  s(2);
  s(3);

  expect(spy).toBeCalledTimes(2);
  expect(spy).toHaveBeenNthCalledWith(1, 1);
  expect(spy).toHaveBeenNthCalledWith(2, 2, 1);
});

test('should work ready from signal', async () => {
  const spy = jest.fn();

  const s = signal(1);
  const r = ready.from(s);

  sync(r, spy);

  s(1);
  s(3);

  expect(spy).toBeCalledTimes(2);
  expect(spy).toHaveBeenNthCalledWith(1, 1);
  expect(spy).toHaveBeenNthCalledWith(2, 1, 1);
});
