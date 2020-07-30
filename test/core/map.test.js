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

