const fs = require("fs");
const wabt_factory = require("wabt");
const path = require("path");

run();

async function run() {
  const wabt = await wabt_factory();
  const input_wat = path.resolve("../lib/index.wat");
  const wasm_module = wabt.parseWat(input_wat, fs.readFileSync(input_wat, "utf8"));
  const { buffer } = wasm_module.toBinary({});
  await main(Buffer.from(buffer));
}

async function main(wasm_buffer) {
  const memory = new WebAssembly.Memory({ initial: 1 });

  const log_i32 = (...args) => console.log(...args);

  const wasm_module = await WebAssembly.compile(wasm_buffer);
  const wasm_instance = new WebAssembly.Instance(wasm_module, {
    env: {
      memory,
      log_i32
    }
  });

  const {
    set_create,
    set_add,
    set_has,
    set_delete,
    set_free
  } = wasm_instance.exports;

  function set_extract(id) {
    const [ len ] = new Uint32Array(memory.buffer, id, 1);
    const values = new Uint32Array(memory.buffer, id + 4, len);
    console.log("EXTRACT:", id, len, [...values]);
  }

  const id = set_create();
  console.log("SET CREATE", id);

  set_add(id, 10);
  set_add(id, 15);
  set_add(id, 10);
  set_add(id, 0);
  set_add(id, 2);
  set_extract(id);

  console.log("HAS:", 10, set_has(id, 10));
  console.log("HAS:", 15, set_has(id, 15));
  console.log("HAS:", 0, set_has(id, 0));
  console.log("HAS:", 2, set_has(id, 2));
  console.log("HAS:", 5, set_has(id, 5));

  console.log("DELETE:", 10, set_delete(id, 10));
  set_extract(id);
  console.log("DELETE:", 2, set_delete(id, 2));
  set_extract(id);
  console.log("DELETE:", 15, set_delete(id, 15));
  set_extract(id);
  console.log("DELETE:", 5, set_delete(id, 5));
  set_extract(id);
  console.log("DELETE:", 0, set_delete(id, 0));
  set_extract(id);

  set_extract(id);
  set_free(id);
}
