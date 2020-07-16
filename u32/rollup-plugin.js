const
  { compile } = require("./u32/compiler/index.js"),
  { module_js_block } = require("./u32/lib/js-block.js");

export default u32;

function u32() {
  return {
    name: "u32",

    load(id) {
      if (/\.u32$/.test(id)) {
        return compile(id).then(b => b.toString("binary"));
      }
      return null;
    },

    transform(code, id) {
      if (code && /\.u32$/.test(id)) {
        return module_js_block(
          Buffer.from(code, "binary")
        );
      }
      return null;
    }
  };
}
