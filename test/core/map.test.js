import {
  map_create, map_size, map_has, map_get, map_set, map_delete, map_free,
  map_extract_keys, map_extract_values, map_extract
} from "../../lib/core/test";

test("should work map methods", () => {
  const id = map_create();

  expect(map_extract(id)).toStrictEqual([]);

  map_set(id, 10, 10);
  expect(map_extract(id)).toStrictEqual([[10, 10]]);
  map_set(id, 15, 2);
  expect(map_extract(id)).toStrictEqual([[10, 10], [15, 2]]);
  map_set(id, 10, 7);
  expect(map_extract(id)).toStrictEqual([[10, 7], [15, 2]]);

  map_set(id, 0, 1);
  map_set(id, 2, 10);

  expect(map_extract(id)).toStrictEqual([
    [0, 1],
    [2, 10],
    [10, 7],
    [15, 2],
  ]);

  expect(map_has(id, 0)).toBe(1);
  expect(map_has(id, 2)).toBe(1);
  expect(map_has(id, 10)).toBe(1);
  expect(map_has(id, 15)).toBe(1);
  expect(map_has(id, 16)).toBe(0);
  expect(map_has(id, 1)).toBe(0);

  expect(map_get(id, 0)).toBe(1);
  expect(map_get(id, 2)).toBe(10);
  expect(map_get(id, 10)).toBe(7);
  expect(map_get(id, 15)).toBe(2);

  map_delete(id, 16);
  expect(map_size(id)).toBe(4);

  map_delete(id, 15)
  expect(map_extract_keys(id)).toStrictEqual([0, 2, 10]);
  expect(map_extract_values(id)).toStrictEqual([1, 10, 7]);

  map_delete(id, 0);
  map_delete(id, 10);

  expect(map_extract(id)).toStrictEqual([[2, 10]]);

  map_set(id, 2, 1);
  expect(map_extract(id)).toStrictEqual([[2, 1]]);
});

test("should work map grow", () => {
  let id = map_create();

  for (let i = 0; i < 40; i++) {
    map_set(id, i, 100 + i);
  }

  expect(map_extract(id)).toStrictEqual([
    0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
  ].map(i => [i, 100 + i]));

  map_free(id)

  let k = map_create();

  expect(k).toBe(id);
  expect(map_extract(k)).toStrictEqual([]);

  for (let i = 39; i >= 0; i--) {
    map_set(k, i, 100 + i);
  }

  expect(map_extract(k)).toStrictEqual([
    0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
  ].map(i => [i, 100 + i]));
});
