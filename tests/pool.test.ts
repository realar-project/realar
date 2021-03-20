import { pool, stoppable } from '../src';
import { delay } from './lib';

test('should work basic operations with pool', async () => {
  const spy = jest.fn();
  let i = 0;

  const p = pool(async () => {
    const id = i++;
    const stop = stoppable();
    spy(stop.val, id);
    await delay(10);
    spy(stop.val, id);
  });

  expect(p.pending.val).toBe(false);

  p();
  p();
  expect(p.pending.val).toBe(true);
  expect(p.count.val).toBe(2);

  expect(spy).toBeCalledTimes(2);
  expect(spy).toHaveBeenNthCalledWith(1, false, 0);
  expect(spy).toHaveBeenNthCalledWith(2, false, 1);

  p.threads.val[0]();

  expect(p.pending.val).toBe(true);
  expect(p.count.val).toBe(1);
  expect(p.threads.val.length).toBe(1);

  await delay(20);

  expect(spy).toBeCalledTimes(4);
  expect(spy).toHaveBeenNthCalledWith(3, true, 0);
  expect(spy).toHaveBeenNthCalledWith(4, false, 1);

  expect(p.pending.val).toBe(false);
  expect(p.count.val).toBe(0);
});

test('should work correct pool with not async function', async () => {
  const spy = jest.fn();

  const p = (pool as any)(() => {
    expect(p.pending.val).toBe(true);
    return 10;
  });

  expect(p.pending.val).toBe(false);
  p.pending.watch(spy);

  expect(p()).toBe(10);
  expect(p.threads.val).toEqual([]);
  expect(p.pending.val).toBe(false);

  expect(spy).toBeCalledTimes(2);
  expect(spy).toHaveBeenNthCalledWith(1, true, false);
  expect(spy).toHaveBeenNthCalledWith(2, false, true);
});
