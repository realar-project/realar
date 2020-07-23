import core_factory from "./u32/index.u32";

const core = make();

const {
  memory,
  push, pop,
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

function mem_extract() {
  const [ size ] = new Uint32Array(memory.buffer, 0, 1);
  const mem = new Uint32Array(memory.buffer, 0, size);
  return Array.from(mem);
}

function set_extract(id) {
  const [ size ] = new Uint32Array(memory.buffer, id * 4, 1);
  const mem = new Uint32Array(memory.buffer, id * 4 + 4, size);
  return Array.from(mem);
}
