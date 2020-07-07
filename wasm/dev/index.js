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
  const wasm_module = await WebAssembly.compile(wasm_buffer);
  const wasm_instance = new WebAssembly.Instance(wasm_module, {
    env: {
        memory: new WebAssembly.Memory({
            initial: 1
        })
    }
  });

  const {
    set_create,
    set_add,
    set_has,
    set_delete,
    set_extract
  } = wasm_instance.exports;

  const id = set_create();
  console.log("SET CREATE", id);

  set_add(id, 10);
  console.log("SET ADD", id, 10);

  if (set_has(id, 1)) {
    set_delete(id, 1);
  }

  console.log("EXTRACT:", set_extract());
}
