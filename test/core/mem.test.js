import {
  mem_alloc, mem_size, mem_free, mem_x4, get_mem_map,
  map_extract, mem_map_extract, arr_extract,
  get_mem_tail, map_extract_keys, map_extract_values, arr_len,
  arr_create, arr_push
} from "../../lib/core/test";

test("should work mem free", () => {
  expect(get_mem_map()).not.toBe(0);

  let t = get_mem_tail();
  let p = mem_alloc(10);

  expect(t).toBe(p);
  expect(mem_size(p)).toBe(10);

  let t1 = get_mem_tail();

  mem_free(p);
  let t2 = get_mem_tail();

  expect(t2 - t1).toBe(34 + 34); // arr(2) + arr(10)

  expect(mem_map_extract()).toEqual([
    [2, [t]],
    [10, [t + 2]]
  ]);
});

test("should work mem free several blocks", () => {
  let offs = get_mem_tail();
  let m = [mem_alloc(10), mem_alloc(10), mem_alloc(10), mem_alloc(10), mem_alloc(10)];
  mem_free(m[0]);
  mem_free(m[1]);
  mem_free(m[2]);
  mem_free(m[3]);
  mem_free(m[4]);

  expect(m[0]).toBe(offs);
  expect(m[1]).toBe(offs + 12);
  expect(m[2]).toBe(offs + 24);
  expect(m[3]).toBe(offs + 36);
  expect(m[4]).toBe(offs + 48);

  expect(map_extract_keys(get_mem_map())).toStrictEqual([2, 10]);
  expect(map_extract_values(get_mem_map()).map(id => arr_extract(id))).toStrictEqual([
    [offs, offs + 12, offs + 24, offs + 36, offs + 48],
    [offs + 2, offs + 12 + 2, offs + 24 + 2, offs + 36 + 2, offs + 48 + 2],
  ]);

  let k = [mem_alloc(10), mem_alloc(11), mem_alloc(10)];

  expect(map_extract_values(get_mem_map()).map(id => arr_len(id))).toStrictEqual([2, 3]);
  expect(k[0]).toBe(m[4]);
  expect(k[1]).toBe(m[3]);
  expect(k[2]).toBe(m[2]);

  let p = [mem_alloc(10), mem_alloc(10)];

  expect(map_extract_keys(get_mem_map())).toStrictEqual([2, 10]);
  expect(map_extract_values(get_mem_map()).map(id => arr_len(id))).toStrictEqual([0, 1]);
  expect(p[0]).toBe(m[1]);
  expect(p[1]).toBe(m[0]);

  let a = mem_alloc(10);
  let b = mem_alloc(10);
  expect(map_extract_values(get_mem_map()).map(id => arr_len(id))).toStrictEqual([0, 0]);

  mem_free(a);
  expect(map_extract_values(get_mem_map()).map(id => arr_len(id))).toStrictEqual([1, 1]);
  mem_free(b);
  expect(map_extract_values(get_mem_map()).map(id => arr_len(id))).toStrictEqual([2, 2]);
});

test("should grow memory", () => {
  let arr = arr_create();
  let arr_exp = [];
  for (let i = 0; i < 1000000; i++) {
    arr_push(arr, i);
    arr_exp.push(i);
  }
  expect(arr_extract(arr)).toStrictEqual(arr_exp);
});
