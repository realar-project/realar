import { core, fns } from ".";

const {
  get_memory,
  set_create, set_size, set_assign, set_clear, set_add, set_has, set_delete, set_free, set_data_ptr,
  arr_create, arr_len, arr_push, arr_pop, arr_delete, arr_free, arr_data_ptr,
  map_create, map_size, map_set, map_get, map_has, map_delete, map_free, map_keys, map_values,
  mem_alloc, mem_size, mem_free, mem_x4, get_mem_map,
  get_mem_tail,
  get_tick_changed, get_tick_deep, tick_deep_inc, tick_deep_dec, tick_start, get_box_rels, get_box_invalid, box_deep_invalidate, get_box_expr, tick_finish,
  b0: box_value_create,
  b1: box_value_get_phase,
  b2: box_value_set_phase,
  b3: box_expr_create,
  b4: box_expr_start,
  b5: box_expr_finish,
  b6: box_computed_create,
  b7: box_computed_start,
  b8: box_computed_finish,
  b9: box_entry_start,
  ba: box_entry_finish,
  bb: box_view_create,
  bc: box_view_start,
  bd: box_view_finish
} = core;

export * from ".";
export {
  fns,
  mem_extract,
  set_create, set_size, set_assign, set_clear, set_add, set_has, set_delete, set_free, set_extract,
  arr_create, arr_len, arr_push, arr_pop, arr_delete, arr_free, arr_extract,
  map_create, map_size, map_set, map_get, map_has, map_delete, map_free, map_extract_keys, map_extract_values, map_extract,
  mem_alloc, mem_size, mem_free, mem_x4, get_mem_map, mem_map_extract,
  get_mem_tail,
  get_tick_changed, get_tick_deep, tick_deep_inc, tick_deep_dec, tick_start, get_box_rels, get_box_invalid, box_deep_invalidate, get_box_expr, tick_finish,
  box_value_create, box_value_get_phase, box_value_set_phase,
  box_expr_create, box_expr_start, box_expr_finish,
  box_computed_create, box_computed_start, box_computed_finish,
  box_entry_start, box_entry_finish, box_view_create, box_view_start, box_view_finish,
};

function mem_extract(ptr_u32, size) {
  return Array.from(new Uint32Array(get_memory().buffer, ptr_u32 << 2, size));
}

function set_extract(id) {
  return mem_extract(set_data_ptr(id), set_size(id));
}

function arr_extract(id) {
  return mem_extract(arr_data_ptr(id), arr_len(id));
}

function map_extract_keys(id) {
  return set_extract(map_keys(id))
}

function map_extract_values(id) {
  return arr_extract(map_values(id))
}

function map_extract(id) {
  const keys = map_extract_keys(id);
  const values = map_extract_values(id);
  return keys.map((k, i) => [k, values[i]]);
}

function mem_map_extract() {
  let map = map_extract(get_mem_map());
  return map.map(([k, v]) => [k, arr_extract(v)]);
}
