import { signal } from '../src';

test('should work basic operations with watch and wrapped signal', async () => {
  const spy = jest.fn();

  const s = signal(0);
  const s_1 = s.wrap(
    (v: string) => parseInt(v + v),
    (g: number) => g + 77
  );
  const s_2 = s_1.wrap((v: number) => '' + (v + 1));

  s_2.watch(spy);

  s_2(10);
  expect(spy).toBeCalledWith(1188, 77);
  expect(s_2.get()).toBe(1188);
});