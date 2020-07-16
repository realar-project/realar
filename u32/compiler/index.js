const
  fs = require("fs"),
  path = require("path"),
  wabt_factory = require("wabt"),
  { preprocess } = require("./preprocess");

module.exports = {
  compile
};

async function compile(inp_filename) {
  let code_str = fs.readFileSync(inp_filename, "utf8");
  code_str = preprocess(code_str, path.dirname(inp_filename));
  const wabt = await wabt_factory();
  const module = wabt.parseWat(inp_filename, code_str);
  return Buffer.from(module.toBinary({}).buffer);
}
