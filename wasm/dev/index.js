const fs = require("fs");
const wasmSource = new Uint8Array(fs.readFileSync("index.wasm"));
const wasmModule = new WebAssembly.Module(wasmSource);
const wasmInstance = new WebAssembly.Instance(wasmModule, {
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
} = wasmInstance.exports;

const id = set_create();
console.log("SET CREATE", id);

set_add(id, 10);
console.log("SET ADD", id, 10);

if (set_has(id, 1)) {
  set_delete(id, 1);
}

console.log("EXTRACT:", set_extract());
