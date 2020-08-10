import {
  arr_create, arr_len, arr_push, arr_pop, arr_free, arr_delete, arr_extract
} from "../../lib/core/debug";

test("should work arr methods", () => {
  const id = arr_create();

  expect(arr_extract(id)).toStrictEqual([]);

  arr_push(id, 10);
  arr_push(id, 15);
  arr_push(id, 10);
  arr_push(id, 0);
  arr_push(id, 2);

  expect(arr_extract(id)).toStrictEqual([10, 15, 10, 0, 2]);

  expect(arr_pop(id)).toBe(2);
  expect(arr_extract(id)).toStrictEqual([10, 15, 10, 0]);

  expect(arr_pop(id)).toBe(0);
  expect(arr_extract(id)).toStrictEqual([10, 15, 10]);

  arr_delete(id, 0);
  expect(arr_extract(id)).toStrictEqual([15, 10]);
  arr_delete(id, 1);
  expect(arr_extract(id)).toStrictEqual([15]);
  arr_delete(id, 0);
  expect(arr_extract(id)).toStrictEqual([]);

  arr_push(id, 2);
  expect(arr_extract(id)).toStrictEqual([2]);
});

test("should work arr grow", () => {
  const id = arr_create();

  for (let i = 0; i < 40; i++) {
    arr_push(id, i);
  }

  expect(arr_extract(id)).toStrictEqual([
    0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
  ]);
});

