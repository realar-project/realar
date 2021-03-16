import { signal, cycle, on } from '../src';

test('should work signal different using', () => {
  const spy = jest.fn();

  const a = signal(10);
  on(a, spy);

  const [get] = a;

  expect(a.val).toBe(10);
  expect(a[0]()).toBe(10);
  expect(get()).toBe(10);

  expect(spy).toBeCalledTimes(0);
  a(10);
  expect(spy).toBeCalledTimes(1);
  expect(spy).toHaveBeenLastCalledWith(10, 10);

  a(a.val + 5);
  expect(a.val).toBe(15);
  expect(a[0]()).toBe(15);
  expect(get()).toBe(15);
  expect(a.get()).toBe(15);

  expect(spy).toBeCalledTimes(2);
  expect(spy).toHaveBeenLastCalledWith(15, 10);
});

test('should work signal in cycle', () => {
  const spy = jest.fn();

  const a = signal<number>();
  cycle(() => {
    const data = a[0]();
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

  const a = signal<number>();
  const fn = async () => {
    spy(await a);
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

  const a = signal<'up' | 'down'>();
  on(a, v => {
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

  const a = signal(0).wrap((s: string) => parseInt(s) + 10);
  on(a, v => {
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
