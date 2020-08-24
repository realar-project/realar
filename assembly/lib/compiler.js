const
  fs = require("fs"),
  path = require("path"),
  deasync = require("deasync"),
  execa = require("execa");

const
  wat_code_path = path.join(__dirname, "../.build/code.wat"),
  wasm_code_path = path.join(__dirname, "../.build/code.wasm"),
  asc_cmd_path = path.join(__dirname, "../../node_modules/.bin/asc");

const compile_sync = deasync(function(inp_filename, cb) {
  compile(inp_filename).then(buff => cb(null, buff));
});

module.exports = {
  compile,
  compile_sync
};

async function compile(inp_filename) {
  execa.sync(asc_cmd_path, [
    inp_filename,
    "-b",
    wasm_code_path,
    "-t",
    wat_code_path,
    "--runtime",
    "none",
    "-O3",
    "--noAssert"
  ]);
  return fs.readFileSync(wasm_code_path);
}
