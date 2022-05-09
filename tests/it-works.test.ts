import { re, set, get } from '../src';

test('should works', () => {
  const a = re(0);

  set(a, 10);
  expect(get(a)).toBe(10);
});

