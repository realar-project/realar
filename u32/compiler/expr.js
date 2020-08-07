const
  $_NODE = 1,
  NUM_NODE = 2,
  OP_NODE = 3,
  WAT_NODE = 4,
  type_key = 0,
  text_key = 1,
  tree_i_key = 2,
  priority_key = 3,
  unary_key = 4;

module.exports = {
  expr_to_wat
};

function local_add(local_name) {
  require("./preprocess").func_local_section_add(local_name);
}

function expr_to_wat(text) {
  // console.log(text);
  const pattern = /<<|>>|!=|==|>=|<=|\|\||&&|[%*\/+\-><=!,]|[\(\)\[\]]|[a-z_][a-z_0-9]*|0|[1-9][0-9]*|[A-Z_][A-Z_0-9]*/gm;
  const num_pattern = /[0-9]/;
  const $_pattern = /[a-z_]/;
  const const_pattern = /[A-Z_]/;

  let tree = [];
  let tree_i_next = 0;
  let m;
  while(m = pattern.exec(text)) {
    const text = m[0];
    if ($_pattern.test(text) || const_pattern.test(text)) {
      tree.push([ $_NODE, text, tree_i_next++ ]);
    }
    else if (num_pattern.test(text)) {
      tree.push([ NUM_NODE, text, tree_i_next++ ]);
    }
    else {
      let p, u;
      /*operation       | priority
        --------------------------
        = store         | 1
        ( [             | 2
        ,               | 3
        || &&           | 4
        == != >= <= > < | 5
        >> <<           | 6
        + -             | 7
        * / %           | 8
        ! load unary    | 9
        call            | 10
      */
      switch(text) {
        case "=":
          p = 1; break;
        case "(":
          p = 2; break;
        case "[": case "]":
          p = 2; u = 1; break;
        case ",":
          p = 3; break;
        case "||": case "&&":
          p = 4; break;
        case "==": case "!=": case ">=": case "<=": case ">": case "<":
          p = 5; break;
        case ">>": case "<<":
          p = 6; break;
        case "+": case "-":
          p = 7; break;
        case "*": case "/": case "%":
          p = 8; break;
        case "!":
          p = 9; u = 1; break;
        default:
          p = 0;
          u = 0;
      }
      tree.push([
        OP_NODE,
        m[0],
        tree_i_next++,
        p,
        u
      ]);
    }
  }

  let
    value_stack = [],
    op_stack = [],
    top_op_stack_p = 0,
    len = tree.length,
    i;

  try {

  // console.log("TREE", tree);
  for (i = 0; i < len; i++) {
    const node = tree[i];
    // console.log("NODE", node);
    const [type, text, tree_i, p] = node;
    if (type === NUM_NODE || type === $_NODE) {
      // console.log("PUSH", node);
      value_stack.push(node);
      continue;
    }
    if (!top_op_stack_p) {
      top_op_stack_p = p;
      op_stack.push(node);
      continue;
    }
    if (text === ")") {
      while(op_stack.length) {
        const op = op_stack.pop();
        if (op[text_key] === "(") {
          const op_tree_i = op[tree_i_key];
          if (op_tree_i > 0 && tree[op_tree_i - 1][type_key] === $_NODE) {
            let unary = 0;
            if (op[tree_i_key] + 1 === tree_i) {
              unary = 1;
            }
            op_stack.push([
              OP_NODE,
              "call",
              0,
              10,
              unary
            ]);
          }
          break;
        }
        if (op[unary_key]) {
          value_stack.push(
            make_unary_op(op, value_stack.pop())
          );
        } else {
          value_stack.push(
            make_binary_op(op, value_stack.pop(), value_stack.pop())
          );
        }
      }
      let len = op_stack.length;
      if (len) {
        top_op_stack_p = op_stack[len - 1][priority_key];
      } else {
        top_op_stack_p = 0;
      }
      continue;
    }
    if (text === "=" && top_op_stack_p === 1) {
      continue;
    }
    if (text === "]") {
      while(op_stack.length) {
        const op = op_stack.pop();
        if (op[text_key] === "[") {
          if (tree_i < tree.length - 1) {
            const [type, text] = tree[tree_i + 1];
            if (type === OP_NODE && text === "=") {
              op_stack.push([
                OP_NODE,
                "store",
                0,
                1,
                0
              ]);
              break;
            }
          }
          op_stack.push([
            OP_NODE,
            "load",
            0,
            9,
            1
          ]);
          break;
        }
        if (op[unary_key]) {
          value_stack.push(
            make_unary_op(op, value_stack.pop())
          );
        } else {
          value_stack.push(
            make_binary_op(op, value_stack.pop(), value_stack.pop())
          );
        }
      }
      let len = op_stack.length;
      if (len) {
        top_op_stack_p = op_stack[len - 1][priority_key];
      } else {
        top_op_stack_p = 0;
      }
      continue;
    }
    if (text === "(" || text === "[") {
      op_stack.push(node);
      top_op_stack_p = p;
      continue;
    }

    if (p >= top_op_stack_p) {
      op_stack.push(node);
      top_op_stack_p = p;
    } else {
      let
        next_top_op_stack_p,
        len = op_stack.length;

      while(len) {
        const op = op_stack.pop();
        len -= 1;

        if (op[unary_key]) {
          value_stack.push(
            make_unary_op(op, value_stack.pop())
          );
        } else {
          value_stack.push(
            make_binary_op(op, value_stack.pop(), value_stack.pop())
          );
        }

        if (!len) break;
        next_top_op_stack_p = op_stack[len - 1][priority_key];
        if (p > next_top_op_stack_p) break;
      }

      op_stack.push(node);
      top_op_stack_p = p;
    }
  }

  // console.log("BEFORE EXIT", op_stack, value_stack);

  while(op_stack.length) {
    const op = op_stack.pop();
    if (op[unary_key]) {
      value_stack.push(
        make_unary_op(op, value_stack.pop())
      );
    } else {
      value_stack.push(
        make_binary_op(op, value_stack.pop(), value_stack.pop())
      );
    }
  }

  const res = wat_get_value(value_stack.pop());
  // console.log(res);
  return res;

  } catch(e) {
    console.error("EXPR: ", text);
    // console.error(value_stack, op_stack, tree);
    throw e;
  }
}

function wat_get_value(node) {
  if (!node) throw "Out of stack";

  const [type, text] = node;
  if (type === $_NODE) {
    local_add(text);
    return `(local.get $${text})`;
  }
  if (type === NUM_NODE) {
    return `(i32.const ${text})`;
  }
  if (type === WAT_NODE) {
    return text;
  }
}

function make_unary_op(op, right) {
  let wat;
  switch(op[text_key]) {
    case "!":
      wat = `(i32.eqz ${wat_get_value(right)})`;
      break;
    case "load":
      wat = `(i32.load (i32.shl ${wat_get_value(right)} (i32.const 2)))`;
      break;
    case "call":
      wat = `(call $${right[text_key]})`;
      break;
    default:
      wat = `(unknown ${op[text_key]})`;
      break;
  }
  return [
    WAT_NODE,
    wat
  ];
}

function make_binary_op(op, right, left) {
  let wat;
  switch(op[text_key]) {
    case "+":
      wat = `(i32.add ${wat_get_value(left)} ${wat_get_value(right)})`;
      break;
    case "-":
      wat = `(i32.sub ${wat_get_value(left)} ${wat_get_value(right)})`;
      break;
    case "*":
      wat = `(i32.mul ${wat_get_value(left)} ${wat_get_value(right)})`;
      break;
    case "<<":
      wat = `(i32.shl ${wat_get_value(left)} ${wat_get_value(right)})`;
      break;
    case ">>":
      wat = `(i32.shr_u ${wat_get_value(left)} ${wat_get_value(right)})`;
      break;
    case "||":
      wat = `(i32.or ${wat_get_value(left)} ${wat_get_value(right)})`;
      break;
    case "&&":
      wat = `(i32.and ${wat_get_value(left)} ${wat_get_value(right)})`;
      break;
    case "==":
      wat = `(i32.eq ${wat_get_value(left)} ${wat_get_value(right)})`;
      break;
    case "!=":
      wat = `(i32.ne ${wat_get_value(left)} ${wat_get_value(right)})`;
      break;
    case ">":
      wat = `(i32.gt_u ${wat_get_value(left)} ${wat_get_value(right)})`;
      break;
    case "<":
      wat = `(i32.lt_u ${wat_get_value(left)} ${wat_get_value(right)})`;
      break;
    case "store":
      wat = `(i32.store (i32.shl ${wat_get_value(left)} (i32.const 2)) ${wat_get_value(right)})`;
      break;
    case "=":
      local_add(left[text_key]);
      wat = `(local.set $${left[text_key]} ${wat_get_value(right)})`;
      break;
    case ",":
      wat = `${wat_get_value(left)} ${wat_get_value(right)}`;
      break;
    case "call":
      wat = `(call $${left[text_key]} ${wat_get_value(right)})`;
      break;
    default:
      wat = `(unknown ${op[text_key]})`;
      break;
  }
  return [
    WAT_NODE,
    wat
  ];
}
