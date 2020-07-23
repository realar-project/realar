import {
  set_add,
  set_create,
  set_delete,
  set_has,
  set_extract
} from "../../lib/core";

test.each([44, 61, 61, 61])("should work set methods", (expected_id) => {
  const id = set_create();

  expect(set_extract(id)).toStrictEqual([]);
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

  expect(set_delete(id, 10)).toBe(1);
  expect(set_extract(id)).toStrictEqual([0, 2, 15]);
  expect(set_delete(id, 2)).toBe(1);
  expect(set_extract(id)).toStrictEqual([0, 15]);
  expect(set_delete(id, 5)).toBe(0);
  expect(set_extract(id)).toStrictEqual([0, 15]);
  expect(set_delete(id, 15)).toBe(1);
  expect(set_extract(id)).toStrictEqual([0]);
  expect(set_delete(id, 0)).toBe(1);
  expect(set_extract(id)).toStrictEqual([]);

  set_add(id, 2);
  expect(set_extract(id)).toStrictEqual([2]);
});

