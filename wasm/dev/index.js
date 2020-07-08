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

  const wasm_module = await WebAssembly.compile(wasm_buffer);
  const wasm_instance = new WebAssembly.Instance(wasm_module, { env: { memory } });

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
    console.log(id, len, [...values]);
  }

  const id = set_create();
  console.log("SET CREATE", id);

  console.log("EXTRACT:", set_extract(id));

  set_add(id, 10);
  set_add(id, 15);
  set_add(id, 10);
  set_add(id, 0);

  if (set_has(id, 1)) {
    set_delete(id, 1);
  }

  console.log("EXTRACT:", set_extract(id));
  set_free(id);
}
