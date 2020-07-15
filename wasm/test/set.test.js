import { lib } from "./setup-env";

test.each([128, 256, 384])("should work set methods", (expected_id) => {
  const id = lib.set_create();

  expect(lib.set_extract(id)).toStrictEqual([]);
  expect(id).toBe(expected_id);

  lib.set_add(id, 10);
  lib.set_add(id, 15);
  lib.set_add(id, 10);
  lib.set_add(id, 0);
  lib.set_add(id, 2);

  expect(lib.set_extract(id)).toStrictEqual([0, 2, 10, 15]);

  expect(lib.set_has(id, 10)).toBe(1);
  expect(lib.set_has(id, 15)).toBe(1);
  expect(lib.set_has(id, 0)).toBe(1);
  expect(lib.set_has(id, 5)).toBe(0);
  expect(lib.set_has(id, 2)).toBe(1);
  expect(lib.set_has(id, 20)).toBe(0);

  expect(lib.set_delete(id, 10)).toBe(1);
  expect(lib.set_extract(id)).toStrictEqual([0, 2, 15]);
  expect(lib.set_delete(id, 2)).toBe(1);
  expect(lib.set_extract(id)).toStrictEqual([0, 15]);
  expect(lib.set_delete(id, 5)).toBe(0);
  expect(lib.set_extract(id)).toStrictEqual([0, 15]);
  expect(lib.set_delete(id, 15)).toBe(1);
  expect(lib.set_extract(id)).toStrictEqual([0]);
  expect(lib.set_delete(id, 0)).toBe(1);
  expect(lib.set_extract(id)).toStrictEqual([]);

  lib.set_add(id, 2);
  expect(lib.set_extract(id)).toStrictEqual([2]);
});

