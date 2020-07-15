// import { build_module_buff } from "../../compiler";
import wasm_buff from "../../compiled.wat";

let lib = {};

export {
  lib
}

const outside_process_env = process.env;
const memory = new WebAssembly.Memory({ initial: 1 });

function set_extract(id) {
  const [ len ] = new Uint32Array(memory.buffer, id, 1);
  const values = new Uint32Array(memory.buffer, id + 4, len);
  return [...values];
}

beforeAll(async () => {
  process.env = {};
  // const wasm_buff = await build_module_buff();
  const wasm_module = await WebAssembly.compile(wasm_buff);
  const wasm_instance = new WebAssembly.Instance(wasm_module, {
    env: { memory }
  });

  exports = wasm_instance.exports;
  for (const key of Object.keys(exports)) {
    lib[key] = exports[key];
  }

  lib.seq_id_init();
  lib.set_extract = set_extract;
})

afterAll(() => {
  process.env = outside_process_env;
});
