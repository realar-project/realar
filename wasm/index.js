import wasm from "./compiled.wat";

let
  init_promise = 0,
  init_completed = 0,
  wasm_exports;

export {
  set_create,
  set_add,
  set_has,
  set_delete,
  set_size,
  set_free,
  is_init_completed,
  init
}

function set_create() {
  return wasm_exports.set_create();
}

function set_add(id, value) {
  wasm_exports.set_add(id, value);
}

function set_has(id, value) {
  return wasm_exports.set_had(id, value);
}

function set_delete(id, value) {
  return wasm_exports.set_delete(id, value);
}

function set_size(id) {
  wasm_exports.set_size(id);
}

function set_free(id) {
  wasm_exports.set_free(id);
}

function is_init_completed() {
  return init_completed;
}

async function init(ready) {
  if (init_promise) {
    return init_promise;
  }
  const wasm_promise = WebAssembly.instantiate(wasm);
  init_promise = wasm_promise.then(() => true);

  const wasm_instance = await wasm_promise;
  wasm_exports = wasm_instance.exports;

  wasm_exports.seq_id_init();
  init_completed = 1;
  if (ready) ready();

  return init_promise;
};
