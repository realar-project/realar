export default prep;

function prep() {

  let rootDir = process.cwd();
  if (!/realar$/.test(rootDir)) {
    rootDir = process.env.OLDPWD;
  }

  const { transform } = require(rootDir + "/prep/transform");

  return {
    name: "prep",

    transform(code, id) {
      if (code && /\.js$/.test(id)) {
        return transform(code);
      }
      return null;
    }
  };
}
