import wasm from "./compiled.wat";

(async function() {
  const instance = await WebAssembly.instantiate(wasm);
  const {
    set_create,
    set_add,
    set_has,
    set_delete,
    set_free,
    seq_id_init
  } = instance.exports;

  seq_id_init();

  // TODO:
})();
