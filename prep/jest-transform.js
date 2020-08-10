const
  babel_jest = require("babel-jest"),
  { transform } = require("./transform");

module.exports = make_plugin();

function make_plugin() {
  const cfg = Object.assign({}, babel_jest);
  const _process = cfg.process;
  cfg.process = function() {
    const code = _process.apply(this, arguments);
    return transform(code);
  }
  const _createTransformer = cfg.createTransformer;
  cfg.createTransformer = function() {
    const cfg_1_src = _createTransformer.apply(this, arguments);
    const cfg_1 = Object.assign({}, cfg_1_src);

    const _process = cfg_1.process;
    cfg_1.process = function() {
      const code = _process.apply(this, arguments);
      return transform(code);
    }
    return cfg_1;
  }
  return cfg;
}
