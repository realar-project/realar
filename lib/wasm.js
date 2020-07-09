import wasm from "../wasm/compiled.wat";

let
  init_phase = 0,
  init_completed = 0,
  ready_listeners = new Set(),
  wasm_exports,
  wasm_memory;

export {
  set_create,
  set_add,
  set_has,
  set_delete,
  set_size,
  set_extract,
  set_free,
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

function set_extract(id) {
  const [ size ] = new Uint32Array(wasm_memory.buffer, id, 1);
  return new Uint32Array(wasm_memory.buffer, id + 4, size);
}

function set_free(id) {
  wasm_exports.set_free(id);
}

function init(ready) {
  if (init_completed) {
    if (ready) {
      ready();
      return () => void 0;
    }
    return;
  }

  if (ready) ready_listeners.add(ready);

  if (!init_phase) {
    init_phase = 1;
    wasm_memory = new WebAssembly.Memory({ initial: 512 });

    WebAssembly.compile(wasm)
    .then(module => (
      new WebAssembly.Instance(module, {
        env: {
          memory: wasm_memory
        }
      })
    ))
    .then(
      instance => {
        wasm_exports = instance.exports;
        wasm_exports.seq_id_init();
        init_completed = 1;
        init_phase = 0;

        for (const fn of ready_listeners) fn();
        ready_listeners = [];
      }
    )
  }

  if (ready) {
    return () => ready_listeners.delete(ready);
  }
};
