import {
  mem_alloc, mem_size, mem_free, mem_x4, mem_map,
  map_extract, mem_map_extract,
  mem_tail, map_extract_keys, map_extract_values, arr_len
} from "../../lib/core/test";

test("should work mem free", () => {
  expect(mem_map()).toBe(0);

  let t = mem_tail();
  let p = mem_alloc(10);

  expect(t).toBe(p);
  expect(mem_size(p)).toBe(10);
  expect(mem_map()).toBe(0);

  let t1 = mem_tail();

  mem_free(p);
  let t2 = mem_tail();

  expect(t2 - t1).toBe(73 + 34 + 34); // map(mem) + arr(2) + arr(8)

  expect(mem_map_extract()).toEqual([
    [2, [t]],
    [10, [t + 2]]
  ]);
});

test("should work mem free several blocks", () => {
  let m = [mem_alloc(10), mem_alloc(10), mem_alloc(10), mem_alloc(10), mem_alloc(10)];
  mem_free(m[0]);
  mem_free(m[1]);
  mem_free(m[2]);
  mem_free(m[3]);
  mem_free(m[4]);

  expect(map_extract_keys(mem_map())).toStrictEqual([2, 10]);
  expect(map_extract_values(mem_map()).map(id => arr_len(id))).toStrictEqual([5, 5]);

  let k = [mem_alloc(10), mem_alloc(11), mem_alloc(10)];

  expect(map_extract_values(mem_map()).map(id => arr_len(id))).toStrictEqual([2, 3]);
  expect(k[0]).toBe(m[4]);
  expect(k[1]).toBe(m[3]);
  expect(k[2]).toBe(m[2]);

  let p = [mem_alloc(10), mem_alloc(10)];

  expect(map_extract_keys(mem_map())).toStrictEqual([2, 10]);
  expect(map_extract_values(mem_map()).map(id => arr_len(id))).toStrictEqual([0, 1]);
  expect(p[0]).toBe(m[1]);
  expect(p[1]).toBe(m[0]);

  let a = mem_alloc(10);
  let b = mem_alloc(10);
  expect(map_extract_values(mem_map()).map(id => arr_len(id))).toStrictEqual([0, 0]);

  mem_free(a);
  expect(map_extract_values(mem_map()).map(id => arr_len(id))).toStrictEqual([1, 1]);
  mem_free(b);
  expect(map_extract_values(mem_map()).map(id => arr_len(id))).toStrictEqual([2, 2]);
})
