const
  path = require("path"),
  { types, template } = require("@babel/core");

const
  unit_name = "unit",
  lib_name = process.env.REALAR_DEV ? path.join(__dirname, "../lib") : "realar",
  view_call_name = `require("${lib_name}").view_render`,
  processed = new Set(),
  dec_named_func_tpl = template(`function NAME(){return ${view_call_name}(BODY,arguments,this)}`),
  dec_nonamed_func_tpl = template(`function(){return ${view_call_name}(BODY,arguments,this)}`),
  unit_wrap_tpl = template(`function ID(){return BODY}`);

module.exports = {
  view_call_name,
  plugin
}

function get_dec_func(node) {
  const func = types.functionExpression(
    null,
    node.params,
    node.body,
    node.generator,
    node.async
  );
  let decorated;
  if (node.id) {
    decorated = dec_named_func_tpl({
      NAME: node.id,
      BODY: func
    });
  } else {
    decorated = dec_nonamed_func_tpl({
      BODY: func
    });
  }
  processed.add(decorated);
  return decorated;
}

function plugin() {
  return {
    name: "babel-plugin-realar",
    manipulateOptions(_opts, parserOpts) {
      parserOpts.plugins.push("jsx");
    },
    visitor: {
      Program(_path, _state) {
        processed.clear();
      },
      "JSXElement|JSXFragment"(path, _state) {

        let cursor = path.parentPath;
        while(!types.isProgram(cursor.parent)) {
          cursor = cursor.parentPath;
        }
        let node = cursor.node;

        if (types.isExportNamedDeclaration(node)) {
          if (processed.has(node.declaration)) return;
          const decorated = get_dec_func(node.declaration);
          node.declaration = decorated;
          return; // export named function component
        }
        if (types.isFunctionDeclaration(node)) {
          if (processed.has(node)) return;
          const decorated = get_dec_func(node);
          cursor.replaceWith(decorated);
          return; // functional component in global scope
        }
      },
      CallExpression(path, _state) {
        if (path.node.callee.name === unit_name) {
          const config = path.node.arguments[0];
          if (config) {
            const wrapped = unit_wrap_tpl({
              ID: "",
              BODY: config
            });
            path.node.arguments = [wrapped];
          }
        }
      }
    },
  };
}
