const { view_transform } = require('./view-transform');

const decorator_fn_name = "require('realar').observe";

function plugin() {
  return {
    name: 'babel-plugin-realar',
    manipulateOptions(_opts, parserOpts) {
      parserOpts.plugins.push('jsx');
    },
    visitor: {
      'JSXElement|JSXFragment'(path, state) {
        const { decorator } = state.opts || {};
        view_transform(path, decorator || decorator_fn_name);
      },
    },
  };
}

module.exports = {
  decorator_fn_name,
  plugin
}
