import { prop, cache, on, value, isolate, signal } from '../src';

test('should work basic operations with prop, cache and on', () => {
  const spy = jest.fn();
  class A {
    @prop a = 10;
    @cache get b() {
      return this.a + 1;
    }
  }
  const a = new A();
  on(() => a.b, spy);
  expect(spy).toBeCalledTimes(0);

  a.a += 10;
  expect(spy).toHaveBeenNthCalledWith(1, 21, 11);
  expect(spy).toBeCalledTimes(1);
});

test('should cache return value in on', () => {
  const spy = jest.fn();
  const a = value(0);

  on(() => Math.floor(a.val / 2), spy);

  a.set(1);
  expect(spy).toBeCalledTimes(0);

  a.set(2);
  expect(spy).toHaveBeenNthCalledWith(1, 1, 0);
});

test('should work stop on subscription', () => {
  const spy = jest.fn();
  const a = value(0);

  on(
    () => a.val,
    () => stop()
  );
  const stop = isolate(() => on(() => a.val, spy));
  on(
    () => a.val,
    () => stop()
  );

  a.val = 1;
  expect(spy).toBeCalledTimes(0);
});

test('should work on with reactionable', () => {
  const spy = jest.fn();
  const a = signal(0);
  on(a, spy);
  expect(spy).toBeCalledTimes(0);
  a(1);
  expect(spy).toHaveBeenCalledWith(1, 0); spy.mockReset();
  a(1);
  expect(spy).toHaveBeenCalledWith(1, 1); spy.mockReset();
});

test('should work on once', () => {
  const spy = jest.fn();
  const a = signal(0);
  on.once(a, spy);
  expect(spy).toBeCalledTimes(0);
  a(1);
  expect(spy).toHaveBeenCalledWith(1, 0); spy.mockReset();
  a(2);
  expect(spy).toBeCalledTimes(0);
});

test('should work on manual stop', () => {
  const spy = jest.fn();
  const a = signal(0);
  const stop = on(a, spy);
  expect(spy).toBeCalledTimes(0);
  a(1);
  expect(spy).toHaveBeenCalledWith(1, 0); spy.mockReset();
  a(1);
  expect(spy).toHaveBeenCalledWith(1, 1); spy.mockReset();
  stop();
  a(1);
  expect(spy).toBeCalledTimes(0);
});

