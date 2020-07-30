import core_factory from "./u32/index.u32";

const core = make();

const {
  memory,
  push, pop,
  set_data_ptr,
  set_create, set_add, set_has, set_delete, set_size, set_free
} = core;

export {
  core,
  mem_extract, set_extract,
  push, pop,
  set_create, set_add, set_has, set_delete, set_size, set_free
};

function make() {
  // const time = Date.now();
  const core = core_factory();
  // console.log("u32:", Date.now() - time);
  core.start();
  return core;
}

function mem_extract(ptr_u32, size) {
  return Array.from(
    new Uint32Array(memory.buffer, ptr_u32 << 2, size)
  );
}

function set_extract(id) {
  return mem_extract(set_data_ptr(id), set_size(id));
}
