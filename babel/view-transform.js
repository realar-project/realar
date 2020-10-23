const
  { types, template, traverse } = require("@babel/core");

const
  lib_name = process.env.REALAR_DEV
    ? process.cwd()
    : "realar",
  unit_ns_name = `require("${lib_name}").unit`,
  view_unit_name = `${unit_ns_name}.v`,
  view_processed = new Set();

module.exports = {
  view_transform,
  view_unit_name,
  view_processed
};


function view_transform(path, _state) {
  let cursor = path;
  let cursor_path;

  let is_func_decl = 0;
  let is_func_expr = 0;
  let is_arrow_expr = 0;
  let is_arrow_expr_block = 0;

  let last_fn = 0;
  let last_fn_path;

  while (cursor) {
    if (types.isFunctionDeclaration(cursor.parent) ||
      types.isFunctionExpression(cursor.parent) ||
      types.isArrowFunctionExpression(cursor.parent)
    ) {
      let has_return_statement = types.isArrowFunctionExpression(cursor.parent) &&
        !types.isBlockStatement(cursor.parent.body);

      if (!has_return_statement) {
        traverse(cursor.parent, {
          ReturnStatement(path) {
            let cur = path;

            loop:
            while (cur) {
              switch (true) {
                case types.isFunctionDeclaration(cur.node):
                case types.isFunctionExpression(cur.node):
                case types.isArrowFunctionExpression(cur.node):
                  if (cur.node !== cursor.parent) return;
                  break loop;
              }
              cur = cur.parentPath;
            }

            has_return_statement = true;
          }
        }, cursor.parentPath.scope, cursor.parentPath);
      }

      if (has_return_statement) {
        last_fn = cursor.parent;
        last_fn_path = cursor.parentPath;
      }
    }
    if (types.isProgram(cursor.parent)) {
      break;
    }
    cursor = cursor.parentPath;
  }

  if (!last_fn) return;
  cursor = last_fn;
  cursor_path = last_fn_path;

  if (types.isFunctionDeclaration(cursor)) {
    is_func_decl = 1;
  }
  else if (types.isFunctionExpression(cursor)) {
    is_func_expr = 1;
  }
  else if (types.isArrowFunctionExpression(cursor)) {
    is_arrow_expr = 1;
    if (types.isBlockStatement(cursor.body)) {
      is_arrow_expr_block = 1;
    }
  }

  if (!cursor) return;
  if (view_processed.has(cursor)) {
    return;
  }
  view_processed.add(cursor);

  let node = cursor;

  if (is_func_decl || is_func_expr || is_arrow_expr) {
    let name;

    if (is_func_decl) {
      name = node.id.name;
    } else if (is_func_expr) {
      name = "";
    }

    let body = node.body;
    let params = node.params;
    let _async = node.async;

    function text_async() {
      if (!_async) return "";
      return "async ";
    }

    function text_params() {
      if (!params || !params.length) return '';
      return "PARAMS";
    }

    let c_ret_tmp_name = cursor_path.scope.generateUid("c_ret_tmp");
    let c_unit_v_name = cursor_path.scope.generateUid("c_unit_v");

    let ret_tpl = template(`
      return ${c_ret_tmp_name} = EXPR, ${c_unit_v_name}[1](), ${c_ret_tmp_name};
    `);

    let return_paths = [];
    traverse(cursor, {
      ReturnStatement(path) {
        if (view_processed.has(path.node)) return;

        let cur = path;
        loop:
        while (cur) {
          switch (true) {
            case types.isFunctionDeclaration(cur.node):
            case types.isFunctionExpression(cur.node):
            case types.isArrowFunctionExpression(cur.node):
              if (cur.node !== cursor) return;
              break loop;
          }
          cur = cur.parentPath;
        }

        return_paths.push(path);
      }
    }, cursor_path.scope, cursor_path);

    for (let path of return_paths) {
      let node = ret_tpl({
        EXPR: path.node.argument
      });
      view_processed.add(node);
      path.replaceWith(node);
    }

    function expr_return() {
      if (is_func_expr || is_arrow_expr) return "return ";
      return "";
    }

    function fn_decl() {
      if (is_arrow_expr) {
        return `(${text_params()}) => `;
      }
      return `function NAME(${text_params()})`;
    }

    const tpl_str = `${expr_return()}${text_async()}${fn_decl()}{
      let
        ${c_unit_v_name} = ${view_unit_name},
        ${c_ret_tmp_name};
      ${c_unit_v_name}[0]();
      ${is_arrow_expr && !is_arrow_expr_block ? (
        `return ${c_ret_tmp_name} = BODY, ${c_unit_v_name}[1](), ${c_ret_tmp_name};`
      ) : "BODY"}
      ${return_paths.length || (is_arrow_expr && !is_arrow_expr_block) ? "" : `${c_unit_v_name}[1]();`}
    }`;

    let performed = template(tpl_str)({
      BODY: is_arrow_expr && !is_arrow_expr_block ? types.cloneNode(body) : body.body,
      ...(is_arrow_expr ? {} : {NAME: name}),
      ...(params && params.length ? { PARAMS: params } : {})
    });

    if (is_func_expr || is_arrow_expr) {
      performed = performed.argument;
    }

    cursor_path.replaceWith(performed);

    view_processed.add(performed);
  }
}
