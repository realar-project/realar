export default as;

function as() {

  let rootDir = process.cwd();
  if (!/realar$/.test(rootDir)) {
    rootDir = process.env.OLDPWD;
  }

  const { compile } = require(rootDir + "/as/lib/compiler");
  const { module_js_block } = require(rootDir + "/as/lib/js-block");

  return {
    name: "as",

    load(id) {
      if (/\.ts$/.test(id)) {
        return compile(id).then(b => b.toString("binary"));
      }
      return null;
    },

    transform(code, id) {
      if (code && /\.ts$/.test(id)) {
        return module_js_block(
          Buffer.from(code, "binary")
        );
      }
      return null;
    }
  };
}
