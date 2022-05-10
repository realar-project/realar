import { re, write, read, update } from '../src';

test('should works', () => {
  const a = re(0);

  write(a, 10);
  expect(read(a)).toBe(10);

  update(a, (v) => v + 3);
  expect(read(a)).toBe(13);
});

