import {
  fns,
  tick_start, tick_changed, tick_deep, tick_deep_inc, tick_deep_dec, box_rels, box_invalid, box_deep_invalidate, box_expr, tick_finish,
  set_add, set_create, set_size, set_delete, set_has, set_assign, set_clear, set_extract, set_free, map_set,
  box_expr_create, box_expr_start, box_expr_finish,
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

test("should work tick_finish func", () => {
  tick_deep_inc();
  tick_deep_inc();
  expect(tick_deep()).toBe(2);
  tick_finish();
  expect(tick_deep()).toBe(1);
  expect(set_size(tick_changed())).toBe(0);
  tick_finish();
  expect(tick_deep()).toBe(0);

  let changed = tick_changed();
  set_add(changed, 40)
  set_add(changed, 50)

  let rels_1 = set_create()
  let rels_2 = set_create()
  map_set(box_rels(), 40, rels_1)
  map_set(box_rels(), 50, rels_2)
  set_add(rels_1, 100)
  set_add(rels_2, 110)

  tick_deep_inc();
  tick_finish();
  expect(tick_deep()).toBe(0);
  expect(set_size(changed)).toBe(0);
  expect(set_extract(box_invalid())).toStrictEqual([100, 110]);
  set_clear(box_invalid());


  set_add(changed, 40);
  set_add(changed, 50);

  let s_1 = jest.fn();
  let e_id = box_expr_create();
  let e_fn = () => {
    box_expr_start(e_id);
    s_1();
    box_expr_finish();
  }
  fns.set(e_id, e_fn);

  set_add(rels_2, e_id);
  tick_finish();

});
