import {
  arr_create, arr_len, arr_push, arr_pop, arr_free, arr_delete, arr_extract
} from "../../lib/core/test";

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

