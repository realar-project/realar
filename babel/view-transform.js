const { types, template, traverse } = require('@babel/core');

module.exports = {
  view_transform,
};

function view_transform(path, decorator_fn_name) {
  let cursor = path;
  let cursor_path;

  let is_func_expr = 0;
  let is_arrow_expr = 0;

  let last_fn = 0;
  let last_fn_path;

  while (cursor) {
    if (
      types.isFunctionExpression(cursor.parent) ||
      types.isArrowFunctionExpression(cursor.parent)
    ) {
      let has_return_statement =
        types.isArrowFunctionExpression(cursor.parent) &&
        !types.isBlockStatement(cursor.parent.body);

      if (!has_return_statement) {
        traverse(
          cursor.parent,
          {
            ReturnStatement(path) {
              let cur = path;

              loop: while (cur) {
                switch (true) {
                  case types.isFunctionExpression(cur.node):
                  case types.isArrowFunctionExpression(cur.node):
                    if (cur.node !== cursor.parent) return;
                    break loop;
                }
                cur = cur.parentPath;
              }

              has_return_statement = true;
            },
          },
          cursor.parentPath.scope,
          cursor.parentPath
        );
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

  if (types.isFunctionExpression(cursor)) {
    is_func_expr = 1;
  } else if (types.isArrowFunctionExpression(cursor)) {
    is_arrow_expr = 1;
  }

  if (!cursor) return;
  if (!is_func_expr && !is_arrow_expr) return;

  // Already wrapped
  if (types.isCallExpression(cursor_path.parent)) return;

  const decorated = template(`${decorator_fn_name}(BODY)`)({
    BODY: cursor,
  });
  cursor_path.replaceWith(decorated);
}
