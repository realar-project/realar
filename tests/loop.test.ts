import { loop, signal, on } from '../src';
import { delay } from './lib';

test('should work basic operations with loop', async () => {
  const spy = jest.fn();
  const a = signal();
  const b = signal();
  const c = signal();

  const stop = loop(async () => {
    await Promise.all([a, b]);
    c();
  });
  on(c, () => spy());

  await delay();
  expect(spy).not.toBeCalled();
  a();
  await delay();
  expect(spy).not.toBeCalled();
  b();
  await delay();
  expect(spy).toBeCalled();

  a();
  b();
  await delay();
  expect(spy).toBeCalledTimes(2);

  stop();
  a();
  b();
  await delay();
  expect(spy).toBeCalledTimes(3);

  a();
  b();
  await delay();
  expect(spy).toBeCalledTimes(3);
});
