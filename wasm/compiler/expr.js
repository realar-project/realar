const
  $_NODE = 1,
  NUM_NODE = 2,
  OP_NODE = 3,
  WAT_NODE = 4,
  text_key = 1,
  priority_key = 2,
  unary_key = 3;

module.exports = {
  expr_to_wat
};

function expr_to_wat(text) {
  // text = "$i = ($k + 11) * 2 + 1";
  text = "$i = $m(1 + 2, 10)";

  const pattern = /[%*\/+\-><=!]|<<|>>|!=|==|>=|<=|[\(\)\[\]]|\$[a-z_0-9]+|[1-9][0-9]?/gmi;
  const num_pattern = /[1-9]/;

  let tree = [];
  let m;
  while(m = pattern.exec(text)) {
    const text = m[0];
    if (text[0] === "$") {
      tree.push([ $_NODE, text ]);
    }
    else if (num_pattern.test(text)) {
      tree.push([ NUM_NODE, text ]);
    }
    else {
      let p, u;
      /*operation       | priority
        --------------------------
        =               | 1
        ,               | 2
        []              | 3
        == != >= <= > < | 4
        >> <<           | 5
        + -             | 6
        * / %           | 7
        ! unary         | 8
        ()              | -
      */
      switch(text) {
        case "=":
          p = 1; break;
        case ",":
          p = 2; break;
        case "[": case "]":
          p = 3; break;
        case "==": case "!=": case ">=": case "<=": case ">": case "<":
          p = 4; break;
        case ">>": case "<<":
          p = 5; break;
        case "+": case "-":
          p = 6; break;
        case "*": case "/": case "%":
          p = 7; break;
        case "!":
          p = 8; u = 1; break;
        case "(":
          p = 0; break;
        default:
          p = 0;
          u = 0;
      }
      tree.push([
        OP_NODE,
        m[0],
        p,
        u
      ]);
    }
  }

  let
    out = [],
    value_stack = [],
    op_stack = [],
    top_op_stack_p = 0,
    len = tree.length,
    i;

  for (i = 0; i < len; i++) {
    const node = tree[i];
    const [type, text, p] = node;
    if (type === NUM_NODE || type === $_NODE) {
      value_stack.push(node);
      continue;
    }
    if (!top_op_stack_p) {
      top_op_stack_p = p;
      op_stack.push(node);
      continue;
    }
    if (text === ")") {
      // TODO: Может быть закрывающей скобкой вызова функции

      while(op_stack.length) {
        const op = op_stack.pop();
        if (op[text_key] === "(") {
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
    if (text === "(") {
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

  console.log(value_stack);
  console.log(text);

  return out.join("");
}

function make_unary_op(op, value) {
  return "hello";
}

function wat_get_value(node) {
  const [type, text] = node;
  if (type === $_NODE) {
    return `(local.get ${text})`;
  }
  if (type === NUM_NODE) {
    return `(i32.const ${text})`;
  }
  if (type === WAT_NODE) {
    return text;
  }
}

function make_binary_op(op, right, left) {
  let wat;
  switch(op[text_key]) {
    case "+":
      wat = `(i32.add ${wat_get_value(left)} ${wat_get_value(right)})`;
      break;
    case "*":
      wat = `(i32.mul ${wat_get_value(left)} ${wat_get_value(right)})`;
      break;
    case "=":
      wat = `(local.set ${left[text_key]} ${wat_get_value(right)})`;
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
