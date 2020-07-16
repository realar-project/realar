import core_factory from "./u32/index.u32";
const {
  memory,
  set_create,
  set_add,
  set_has,
  set_delete,
  set_size,
  set_free,
} = make();

export {
  set_add,
  set_create,
  set_delete,
  set_has,
  set_extract,
  set_free,
  set_size
};

function make() {
  const time = Date.now();
  const { exports } = core_factory();
  console.log("u32:", Date.now() - time);
  return exports;
}

function set_extract(id) {
  const [ size ] = new Uint32Array(memory.buffer, id, 1);
  return new Uint32Array(memory.buffer, id + 4, size);
}
