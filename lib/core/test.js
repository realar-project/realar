import { core } from ".";

const {
  memory,
  arr_data_ptr,
  arr_create, arr_len, arr_push, arr_pop, arr_free, arr_delete
} = core;

export * from ".";
export {
  arr_create, arr_len, arr_push, arr_pop, arr_free, arr_delete, arr_extract
};

function arr_extract(id) {
  const len = arr_len(id);
  const mem = new Uint32Array(memory.buffer, arr_data_ptr(id) * 4, len);
  return Array.from(mem);
}
