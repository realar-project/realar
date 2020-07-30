import { core, set_extract, mem_extract } from ".";

const {
  memory,
  arr_create, arr_len, arr_push, arr_pop, arr_free, arr_delete, arr_data_ptr,
  map_create, map_size, map_has, map_get, map_set, map_delete, map_free, map_keys, map_values,
} = core;

export * from ".";
export {
  arr_create, arr_len, arr_push, arr_pop, arr_free, arr_delete, arr_extract,
  map_create, map_size, map_has, map_get, map_set, map_delete, map_free,
  map_extract_keys, map_extract_values, map_extract
};

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
