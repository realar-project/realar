import {
  set_add, set_create, set_delete, set_has, set_assign, set_clear, set_extract, set_free
} from "../../lib/core/test";

let expected_id = 0;

test.each([1, 1])("should work set methods", () => {
  const id = set_create();

  expect(set_extract(id)).toStrictEqual([]);

  if (!expected_id) {
    expected_id = id;
  }

  expect(id).toBe(expected_id);

  set_add(id, 10);
  set_add(id, 15);
  set_add(id, 10);
  set_add(id, 0);
  set_add(id, 2);

  expect(set_extract(id)).toStrictEqual([0, 2, 10, 15]);

  expect(set_has(id, 10)).toBe(1);
  expect(set_has(id, 15)).toBe(1);
  expect(set_has(id, 0)).toBe(1);
  expect(set_has(id, 5)).toBe(0);
  expect(set_has(id, 2)).toBe(1);
  expect(set_has(id, 20)).toBe(0);

  set_delete(id, 10);
  expect(set_extract(id)).toStrictEqual([0, 2, 15]);
  set_delete(id, 2);
  expect(set_extract(id)).toStrictEqual([0, 15]);
  set_delete(id, 5);
  expect(set_extract(id)).toStrictEqual([0, 15]);
  set_delete(id, 15);
  expect(set_extract(id)).toStrictEqual([0]);
  set_delete(id, 0);
  expect(set_extract(id)).toStrictEqual([]);

  set_add(id, 2);
  expect(set_extract(id)).toStrictEqual([2]);
});

test("should work set grow", () => {
  let id = set_create();

  for (let i = 0; i < 40; i++) {
    set_add(id, i);
  }

  expect(set_extract(id)).toStrictEqual([
    0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
  ]);

  set_free(id)

  let k = set_create();

  expect(k).toBe(id);
  expect(set_extract(k)).toStrictEqual([]);

  for (let i = 39; i >= 0; i--) {
    set_add(k, i);
  }

  expect(set_extract(k)).toStrictEqual([
    0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
  ]);
});

test("should work set assign", () => {
  let a = set_create();
  for (let i = 0; i < 40; i++) {
    set_add(a, i);
  }
  let b = set_create();
  set_assign(b, a)
  set_clear(a)

  expect(set_extract(a)).toStrictEqual([]);
  expect(set_extract(b)).toStrictEqual([
    0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
  ]);
});
