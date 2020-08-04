import { core } from ".";

const {
  memory,
  set_create, set_size, set_assign, set_clear, set_add, set_has, set_delete, set_free, set_data_ptr,
  arr_create, arr_len, arr_push, arr_pop, arr_delete, arr_free, arr_data_ptr,
  map_create, map_size, map_set, map_get, map_has, map_delete, map_free, map_keys, map_values,
  mem_alloc, mem_size, mem_free, mem_x4, mem_map,
  mem_tail,
  tick_deep_inc, tick_start, box_rels, box_invalid, box_deep_invalidate
} = core;

export * from ".";
export {
  mem_extract,
  set_create, set_size, set_assign, set_clear, set_add, set_has, set_delete, set_free, set_extract,
  arr_create, arr_len, arr_push, arr_pop, arr_delete, arr_free, arr_extract,
  map_create, map_size, map_set, map_get, map_has, map_delete, map_free, map_extract_keys, map_extract_values, map_extract,
  mem_alloc, mem_size, mem_free, mem_x4, mem_map, mem_map_extract,
  mem_tail,
  tick_deep_inc, tick_start, box_rels, box_invalid, box_deep_invalidate
};

function mem_extract(ptr_u32, size) {
  return Array.from(new Uint32Array(memory.buffer, ptr_u32 << 2, size));
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
  let map = map_extract(mem_map());
  return map.map(([k, v]) => [k, arr_extract(v)]);
}
