import { _signal, cycle, _on, _value } from '../src';

test('should work signal different using', () => {
  const spy = jest.fn();

  const a = _signal(10);
  _on(a, spy);

  const {get} = a;

  expect(a.val).toBe(10);
  expect(get()).toBe(10);

  expect(spy).toBeCalledTimes(0);
  a(10);
  expect(spy).toBeCalledTimes(1);
  expect(spy).toHaveBeenLastCalledWith(10, 10);

  a(a.val + 5);
  expect(a.val).toBe(15);
  expect(get()).toBe(15);
  expect(a.get()).toBe(15);

  expect(spy).toBeCalledTimes(2);
  expect(spy).toHaveBeenLastCalledWith(15, 10);
});

test('should work signal in cycle', () => {
  const spy = jest.fn();

  const a = _signal<number>();
  cycle(() => {
    const data = a.get();
    spy(data);
  });

  expect(spy).toHaveBeenNthCalledWith(1, void 0);
  a(10);
  expect(spy).toHaveBeenNthCalledWith(2, 10);
  expect(spy).toBeCalledTimes(2);
  a(10);
  expect(spy).toHaveBeenNthCalledWith(3, 10);
  expect(spy).toBeCalledTimes(3);
});

test('should work signal as promise', async () => {
  const spy = jest.fn();

  const a = _signal<number>();
  const fn = async () => {
    spy(await a.promise);
  };
  fn();
  expect(spy).toBeCalledTimes(0);
  a(10);
  await new Promise(resolve => setTimeout(resolve, 10));
  expect(spy).toHaveBeenNthCalledWith(1, 10);
  expect(spy).toBeCalledTimes(1);
  fn();
  expect(spy).toBeCalledTimes(1);
  a(10);
  await new Promise(resolve => setTimeout(resolve, 10));
  expect(spy).toBeCalledTimes(2);
  expect(spy).toHaveBeenNthCalledWith(2, 10);
});

test('should work signal in on', () => {
  const spy = jest.fn();

  const a = _signal<'up' | 'down'>();
  _on(a, v => {
    spy(v);
  });

  expect(spy).toBeCalledTimes(0);
  a('up');
  expect(spy).toHaveBeenNthCalledWith(1, 'up');
  expect(spy).toBeCalledTimes(1);
  a('up');
  expect(spy).toHaveBeenNthCalledWith(2, 'up');
  expect(spy).toBeCalledTimes(2);
});

test('should work signal with transform', () => {
  const spy = jest.fn();

  const a = _signal(0).pre((s: string) => parseInt(s) + 10);
  _on(a, v => {
    spy(v);
  });

  expect(spy).toBeCalledTimes(0);
  a('7');
  expect(spy).toHaveBeenNthCalledWith(1, 17);
  expect(spy).toBeCalledTimes(1);
  a('7');
  expect(spy).toHaveBeenNthCalledWith(2, 17);
  expect(spy).toBeCalledTimes(2);
});

test('should work signal from', async () => {
  const v = _value(1);
  const s = _signal.from(v.select(v => v + v));

  setTimeout(() => (v.val = 2), 100);
  expect(s.val).toBe(2);
  expect(await s.promise).toBe(4);
});

test('should work signal combine', async () => {
  const spy = jest.fn();
  const v = _value(1);
  const s = _signal.from(v.select(v => v + v), (k) => v.update(_v => _v + k));

  const c = _signal.combine([v, s]);
  c.to(v => spy(v));

  expect(c.val).toEqual([1, 2]);
  s(4);
  s(4);
  v(2);
  v(2);

  expect(spy).toHaveBeenNthCalledWith(1, [5, 10]);
  expect(spy).toHaveBeenNthCalledWith(2, [9, 18]);
  expect(spy).toHaveBeenNthCalledWith(3, [2, 4]);
  expect(spy).toBeCalledTimes(3);
});
