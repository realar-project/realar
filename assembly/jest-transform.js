const
  { compile_sync } = require("./lib/compiler.js"),
  { common_js_block } = require("./lib/js-block.js");

module.exports = {
  process
};

function process(_code, file) {
  return common_js_block(
    compile_sync(file)
  );
}
