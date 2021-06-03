import { signal, on, value } from '../../src';

test('should work basic operations with pre and signal', async () => {
  const spy = jest.fn();

  const s = signal(0);
  const s_1 = s.pre((v: string) => parseInt(v + v)).map((g: number) => g + 77);
  const s_2 = s_1.pre((v: number) => '' + (v + 1));

  expect(s_1.val).toBe(77);
  s_1('1');
  expect(s_1.val).toBe(88);
  s_2(10);
  expect(s_2.val).toBe(1188);

  const {get, set} = s_2;
  on(s_2, spy);
  set(10);
  expect(spy).toBeCalledWith(1188, 1188);
  expect(get()).toBe(1188);
});

test('should work basic operations with pre and pre.filter', async () => {
  const spy = jest.fn();

  const s = signal(0);
  const s_1 = s.pre.filter((v) => v !== 10 && v !== 15);

  on(s_1, spy);

  s_1(5);
  expect(spy).toHaveBeenCalledTimes(1);
  s_1(10);
  s_1(15);
  expect(spy).toHaveBeenCalledTimes(1);
  s_1(16);
  expect(spy).toHaveBeenCalledTimes(2);
});

test('should work two arguments pre', async () => {
  const v = value(0).pre((k, state) => k + state);
  expect(v.val).toBe(0);
  v(1);
  expect(v.val).toBe(1);
  v(1);
  expect(v.val).toBe(2);
});
