export default u32;

function u32() {

  let rootDir = process.cwd();
  if (!/realar$/.test(rootDir)) {
    rootDir = process.env.OLDPWD;
  }

  const { compile } = require(rootDir + "/u32/compiler");
  const { module_js_block } = require(rootDir + "/u32/lib/js-block");

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
