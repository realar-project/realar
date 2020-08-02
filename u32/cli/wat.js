#! /usr/bin/env node
const fs = require("fs");
const path = require("path");
const { preprocess } = require("../compiler/preprocess");

main();

function main() {
  let argv = process.argv.slice();
  if (argv.length < 3) {
    console.log("Usage: node ./u32/cli/wat.js ./lib/core/u32/index.u32 ./core.wat");
    return;
  }

  let out_filename = argv.pop();
  let inp_filename = argv.pop();
  compile_to_wat(inp_filename, out_filename);
}

function compile_to_wat(inp_filename, out_filename) {
  let code_str = fs.readFileSync(inp_filename, "utf8");
  code_str = preprocess(code_str, path.dirname(inp_filename));
  fs.writeFileSync(out_filename, code_str, "utf8");
}
