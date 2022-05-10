import { re, write, read, update, wrap } from '../src';

describe('should works', () => {

  test('re, read, write', () => {
    const a = re(0);
    write(a, 10);
    expect(read(a)).toBe(10);
  });

  test('update', () => {
    const a = re(0);
    update(a, (v) => v + 3);
    expect(read(a)).toBe(3);
  });

  test('wrap', () => {
    const a = re(1);
    const b = re(2);

    const k = wrap(a);
    const p = wrap(() => read(a) + read(a));
    const n = wrap(a, (v) => write(a, v + 1));
    const m = wrap(() => read(a) + 2, (n) => update(b, (v) => v + n));
    const q = wrap(b, b);

    expect(read(k)).toBe(1);
    expect(read(p)).toBe(2);
    expect(read(n)).toBe(1);
    expect(read(m)).toBe(3);

    write(n, 10);
    expect(read(k)).toBe(11);
    expect(read(p)).toBe(22);
    expect(read(n)).toBe(11);
    expect(read(m)).toBe(13);

    write(m, 10);
    expect(read(b)).toBe(12);

    update(q, (v) => v + 10);
    expect(read(q)).toBe(22);
  });

});

