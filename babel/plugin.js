const
  { unit_transform } = require("./unit-transform"),
  { view_transform, view_processed } = require("./view-transform");

module.exports = {
  plugin
}


function plugin() {
  return {
    name: "babel-plugin-realar",
    manipulateOptions(_opts, parserOpts) {
      parserOpts.plugins.push("jsx");
    },
    visitor: {
      Program(_path, _state) {
        view_processed.clear();
      },
      "JSXElement|JSXFragment"(path, state) {
        view_transform(path, state);
      },
      CallExpression(path, state) {
        switch (path.node.callee.name) {
          case "unit":
            unit_transform(path, state);
            break;
          case "useUnit":
          case "useService":
            view_transform(path, state);
            break;
        }
      }
    },
  };
}
