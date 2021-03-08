import { loop, signal, on } from '../src';
import { nextTick } from './lib';

test('should work basic operations with loop', async () => {
  const spy = jest.fn();
  const a = signal();
  const b = signal();
  const c = signal();

  const stop = loop(async () => {
    await Promise.all([a,b]);
    c();
  });
  on(c, () => spy());

  await nextTick();
  expect(spy).not.toBeCalled();
  a();
  await nextTick();
  expect(spy).not.toBeCalled();
  b();
  await nextTick();
  expect(spy).toBeCalled();

  a();
  b();
  await nextTick();
  expect(spy).toBeCalledTimes(2);

  stop();
  a();
  b();
  await nextTick();
  expect(spy).toBeCalledTimes(3);

  a();
  b();
  await nextTick();
  expect(spy).toBeCalledTimes(3);

});
