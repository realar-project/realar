#! /usr/bin/env node
const
  build_module_buff = require("../compiler").build_module_buff;

main();

async function main() {
  const wasm_buff = await build_module_buff();
  const memory = new WebAssembly.Memory({ initial: 1 });

  const log_i32 = (...args) => console.log(...args);

  const wasm_module = await WebAssembly.compile(wasm_buff);
  const wasm_instance = new WebAssembly.Instance(wasm_module, {
    env: {
      memory,
      log_i32
    }
  });

  const lib = wasm_instance.exports;

  function set_extract(id) {
    const [ len ] = new Uint32Array(memory.buffer, id, 1);
    const values = new Uint32Array(memory.buffer, id + 4, len);
    console.log("EXTRACT:", id, len, [...values], lib.set_size(id));
  }

  lib.seq_id_init();
  lib.set_extract = set_extract;

  function make() {
    const id = lib.set_create();
    console.log("SET CREATE", id);

    lib.set_add(id, 10);
    lib.set_add(id, 15);
    lib.set_add(id, 10);
    lib.set_add(id, 0);
    lib.set_add(id, 2);

    set_extract(id);

    console.log("HAS:", 20, lib.set_has(id, 20));
  }

  make();
}
