const
  fs = require("fs"),
  path = require("path"),
  wabt_factory = require("wabt");

const
  inp_filename = path.resolve(__dirname, "../lib/index.wat"),
  out_filename = path.resolve(__dirname, "../compiled.wat.js");

module.exports = {
  build,
  build_module_buff
};

function process(code) {
  // TODO: preprocess and process
  return code;
}

async function build_module_buff() {
  return await compile(
    fs.readFileSync(inp_filename, "utf8")
  );
}

async function build() {
  output(
    await build_module_buff()
  );
}

async function compile(code_str) {
  code_str = process(code_str);
  const wabt = await wabt_factory();
  const module = wabt.parseWat(inp_filename, code_str);
  return Buffer.from(module.toBinary({}).buffer);
}

function output(buff) {
  fs.writeFileSync(out_filename, (
`const
  buff = atob("${buff.toString("base64")}"),
  len = buff.length,
  bytes = new Uint8Array(len);
for (var i = 0; i < len; i++)
  bytes[i] = buff.charCodeAt(i);
export default bytes;`
  ));
}
