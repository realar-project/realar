const
  fs = require("fs"),
  path = require("path"),
  wabt_factory = require("wabt"),
  deasync = require("deasync"),
  { preprocess, get_string_constants } = require("./preprocess");

const compile_sync = deasync(function(inp_filename, cb) {
  compile(inp_filename).then(buff => cb(null, buff));
});

module.exports = {
  compile,
  compile_sync,
  get_string_constants
};

async function compile(inp_filename) {
  let code_str = fs.readFileSync(inp_filename, "utf8");
  code_str = preprocess(code_str, path.dirname(inp_filename));
  const wabt = await wabt_factory();
  const module = wabt.parseWat(inp_filename, code_str);
  return Buffer.from(module.toBinary({}).buffer);
}
