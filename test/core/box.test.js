import {
  tick_start, tick_deep_inc, box_rels, box_invalid, box_deep_invalidate,
  set_add, set_create, set_delete, set_has, set_assign, set_clear, set_extract, set_free, map_set
} from "../../lib/core/test";

test("should throw tick_start limit error", () => {

  for (let i = 0; i < 100; i++) {
    tick_deep_inc();
  }
  expect(() => {
    tick_start();
  }).toThrow("Tick deep limit exception")

});

test("should work box_deep_invalidate func", () => {

  let changed = set_create();

  set_add(changed, 1)
  set_add(changed, 5)

  let rels_1 = set_create()
  let rels_2 = set_create()
  let rels_3 = set_create()

  map_set(box_rels(), 1, rels_1)
  map_set(box_rels(), 5, rels_2)
  map_set(box_rels(), 3, rels_3)

  set_add(rels_1, 10)
  set_add(rels_1, 11)
  set_add(rels_2, 20)
  set_add(rels_2, 21)
  set_add(rels_3, 30)
  set_add(rels_3, 31)

  let rels_4 = set_create()
  let rels_5 = set_create()
  let rels_6 = set_create()

  map_set(box_rels(), 10, rels_4)
  map_set(box_rels(), 21, rels_5)
  map_set(box_rels(), 31, rels_6)

  set_add(rels_4, 50)
  set_add(rels_5, 60)
  set_add(rels_6, 70)

  let rels_7 = set_create()
  set_add(rels_7, 100)
  set_add(rels_7, 101)
  set_add(rels_7, 103)

  map_set(box_rels(), 50, rels_7)

  box_deep_invalidate(changed);

  expect(set_extract(box_invalid())).toStrictEqual([
    10, 11, 20, 21, 50, 60, 100, 101, 103
  ]);
});

