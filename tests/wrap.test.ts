import { wrap, signal, stoppable, selector, on } from '../src';

test('should work basic operations with wrap and signal', async () => {
  const spy = jest.fn();

  const s = signal(0);
  const s_1 = wrap(s, (v: string) => parseInt(v + v), (g: number) => g + 77);
  const s_2 = wrap(s_1, (v: number) => '' + (v + 1));

  expect(s_1.val).toBe(77);
  s_1('1');
  expect(s_1.val).toBe(88);
  s_2(10);
  expect(s_2.val).toBe(1188);

  const [get, set] = s_2;
  on(s_2, spy);
  set(10);
  expect(spy).toBeCalledWith(1188, 1188);
  expect(get()).toBe(1188);
});

test('should work basic operations with wrap and stoppable', async () => {
  const spy = jest.fn();

  const s = signal(0);
  const s_1 = wrap(s, (v: number) => {
    const stop = stoppable();
    if (v === 10 || v === 15) {
      stop();
    }
    return v;
  });

  on(s_1, spy);

  s_1(5);
  expect(spy).toHaveBeenCalledTimes(1);
  s_1(10);
  s_1(15);
  expect(spy).toHaveBeenCalledTimes(1);
  s_1(16);
  expect(spy).toHaveBeenCalledTimes(2);
});

test('should throw exception if wrap with empty parameters', () => {
  expect(() => {
    (wrap as any)();
  }).toThrow();
});

test('should throw exception if wrap with incorrect parameters', () => {
  expect(() => {
    (wrap as any)(selector(() => 0), () => 0, () => 0);
  }).toThrow('Incorrect wrapping target');

  expect(() => {
    (wrap as any)([], null, () => 0);
  }).toThrow('Incorrect wrapping target');
});
