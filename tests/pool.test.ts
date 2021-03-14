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

  expect(p.pending).toBe(false);

  p();
  p();
  expect(p.pending).toBe(true);
  expect(p.count).toBe(2);

  expect(spy).toBeCalledTimes(2);
  expect(spy).toHaveBeenNthCalledWith(1, false, 0);
  expect(spy).toHaveBeenNthCalledWith(2, false, 1);

  p.threads[0]();

  expect(p.pending).toBe(true);
  expect(p.count).toBe(1);
  expect(p.threads.length).toBe(1);

  await delay(20);

  expect(spy).toBeCalledTimes(4);
  expect(spy).toHaveBeenNthCalledWith(3, true, 0);
  expect(spy).toHaveBeenNthCalledWith(4, false, 1);

  expect(p.pending).toBe(false);
  expect(p.count).toBe(0);
});
