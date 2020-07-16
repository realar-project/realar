const compile = require(__dirname + "/u32/compiler/index.js").compile;

export {
  u32
};

function u32() {
  return {
    name: "u32",

    load(id) {
      if (/\.u32$/.test(id)) {
        return compile(id).then(b => b.toString("binary"));
      }
      return null;
    },

    banner: `
      function _load_u32_module (src, imports) {
        var buf = null
        var isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null
        if (isNode) {
          buf = Buffer.from(src, "base64")
        } else {
          var raw = globalThis.atob(src)
          var rawLength = raw.length
          buf = new Uint8Array(rawLength)
          for(var i = 0; i < rawLength; i++) {
            buf[i] = raw.charCodeAt(i)
          }
        }
        var mod = new WebAssembly.Module(buf)
        return imports ? new WebAssembly.Instance(mod, imports) : mod
      }
    `.trim(),

    transform(code, id) {
      if (code && /\.u32$/.test(id)) {
        const src = Buffer.from(code, "binary").toString("base64");

        const S = 64;
        const list = [];
        const rows = Math.floor(src.length / S);
        for (let i = 0; i < rows; i++) {
          list.push(src.slice(i*S, i*S+S));
        }
        const last = src.length % S;
        if (last) {
          list.push(src.slice(S*rows));
        }
        const src_block = `\n"${list.join(`"+\n"`)}"\n`
        return `export default function(imports){return _load_u32_module(${src_block}, imports)}`;
      }
      return null;
    }
  };
}
