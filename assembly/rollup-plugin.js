export default assembly;

function assembly() {

  let rootDir = process.cwd();
  if (!/realar$/.test(rootDir)) {
    rootDir = process.env.OLDPWD;
  }

  const { compile } = require(rootDir + "/assembly/lib/compiler");
  const { module_js_block } = require(rootDir + "/assembly/lib/js-block");

  return {
    name: "assembly",

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
