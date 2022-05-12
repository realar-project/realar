import {
  re, wrap, read, write, update, select, readonly,
  on, once, sync, cycle,
  shared, free, mock, clear,
  event, filter, map,
} from '../src';

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

  test('select', () => {
    const a = re(1);
    const b = re(2);

    const k = select(a, (v) => v + 5);
    const n = select(k, (v) => '&' + v);
    const m = select(b, (v) => v + read(n));

    expect(read(m)).toBe('2&6');
    write(a, 10);
    expect(read(m)).toBe('2&15');

    update(b, (v) => v + 3);
    expect(read(m)).toBe('5&15');
  });

  test('readonly', () => {
    const a = re(1);
    const k = readonly(a);

    expect(read(k)).toBe(1);
    update(a, (v) => v + 1);
    expect(read(k)).toBe(2);

    expect(() => write(k, 10)).toThrow();
    expect(() => update(k, (v) => v + 1)).toThrow();
  });

  test('on', () => {
    const x = jest.fn();
    const y = jest.fn();

    const a = re(1);
    const b = re(2);

    on(() => read(a) + read(b), (v) => x(v));
    on(a, (v) => y(v));

    expect(x).not.toBeCalled();
    expect(y).not.toBeCalled();

    write(b, 3);
    expect(x).toBeCalledWith(4); x.mockReset();

    write(a, 5);
    expect(x).toBeCalledWith(8);
    expect(y).toBeCalledWith(5);
  });

  test('sync', () => {
    const x = jest.fn();
    const y = jest.fn();

    const a = re(1);
    const b = re(2);

    sync(() => read(a) + read(b), (v) => x(v));
    sync(a, (v) => y(v));

    expect(x).toBeCalledWith(3); x.mockReset();
    expect(y).toBeCalledWith(1); y.mockReset();

    write(b, 3);
    expect(x).toBeCalledWith(4); x.mockReset();

    write(a, 5);
    expect(x).toBeCalledWith(8);
    expect(y).toBeCalledWith(5);
  });

  test('once', () => {
    const x = jest.fn();
    const y = jest.fn();

    const a = re(1);

    once(() => read(a), (v) => x(v));
    once(a, (v) => y(v));

    expect(x).not.toBeCalled();
    expect(y).not.toBeCalled();

    write(a, 3);
    expect(x).toBeCalledWith(3);
    expect(y).toBeCalledWith(3);

    update(a, (v) => v + 1);
    expect(read(a)).toBe(4);
    expect(x).toBeCalledTimes(1);
    expect(y).toBeCalledTimes(1);
  });

  test('cycle', () => {
    const x = jest.fn();

    const a = re(1);
    const b = re(0);

    cycle(() => x(read(a) + read(b)));

    expect(x).toBeCalledWith(1); x.mockReset();

    update(a, (v) => v + 1);
    expect(x).toBeCalledWith(2); x.mockReset();

    write(b, 1);
    expect(x).toBeCalledWith(3);
  });

});

