const
  fs = require("fs"),
  path = require("path"),
  { expr_to_wat } = require("./expr");

const
  import_path_ext = ".wat";

module.exports = {
  preprocess
};

function compile(code, dirname) {
  let
    i, len,
    out = [],
    prev_push_index = 0,
    exclude_section_deep = 0;

  len = code.length;

  i = 0;
  while (i < len) {
    if (code.slice(i, i+7) === "(module") {
      i = i+7;
      continue;
    }
    if (code.slice(i, i+2) === ";;") {
      i = i+2;
      read_line();
      continue;
    }
    if (code[i] === "(") {
      i = i+1;
      go_after_close_bracket();
      continue;
    }
    if (code.slice(i, i+3) === "## ") {
      push_index(i);
      const line = read_line();
      push_comment_block(line);
      push_eol();
      push_preprocess_section(line.slice(3));
      push_eol();
      cut_index(i);
      continue;
    }
    if (code.slice(i, i+4) === "func") {
      push_index(i);
      const line = read_line();
      push_eol();
      push_comment_block(line);
      push_eol();
      push_func_def(line);
      parse_func_body();
      push_eol();
      cut_index(i);
      continue;
    }
    i = i + 1;
  }
  push_index(i);

  return out.join("");

  function read_line() {
    let
      start = i,
      end = len
    ;
    for (;i < len; i++) {
      if (code[i] === "\n") {
        end = i;
        ++i;
        break;
      }
      if (code.slice(i, i+2) === ";;") {
        end = i - 1;
        for (;i < len; i++) {
          if (code[i] === "\n") {
            ++i;
            break;
          }
        }
        break;
      }
    }
    if (end === len) {
      end = i;
    }
    return code.slice(start, end);
  }

  function parse_func_body() {
    let
      block_indent = 1,
      line_indent = 0,
      prev_if = 0,
      read_2, read_3, read_4, line, expr,
      then_section = new Set(),
      else_section = new Set()
    ;

    const expr_with_const_pattern = /^[!0-9_a-zA-Z\[]/m;

    function prev_if_push() {
      if (!prev_if) return;
      push_text("(then ");
      then_section.add(block_indent);
      prev_if = 0;
    }

    function perform_indent() {
      if(block_indent <= line_indent) return;
      let k = block_indent - line_indent;
      while(k--) {
        push_text(")");
        if (then_section.has(block_indent)) {
          push_text(")");
          then_section.delete(block_indent);
        }
        if (else_section.has(block_indent)) {
          push_text(")");
          else_section.delete(block_indent);
        }
        block_indent --;
      }
    }

    while(i < len) {
      if (code[i] === "\n") {
        i = i+1;
        line_indent = 0;
        push_text("\n");
        continue;
      }
      if (code[i] === "(") {
        perform_indent();
        if (line_indent > 0) throw `Unexpected "(" in body function at ${i}`;
        break;
      }

      read_2 = code.slice(i, i+2);
      if (read_2 === ";;") {
        push_line();
        line_indent = 0;
        continue;
      }
      if (read_2 === "  ") {
        i = i+2;
        line_indent += 1;
        push_text("  ");
        continue;
      }

      read_3 = code.slice(i, i+3);
      if (read_3 === "if ") {
        perform_indent();
        prev_if_push();
        i = i+3;
        block_indent += 1;
        prev_if = 1;
        expr = read_line_push_comment();
        push_text(`(if `);
        push_expr(expr);
        push_eol();
        line_indent = 0;
        continue;
      }
      if (read_3 === "br ") {
        perform_indent();
        prev_if_push();
        line = read_line_push_comment();
        push_text_eol(`(${line})`);
        line_indent = 0;
        continue;
      }

      read_4 = code.slice(i, i+4);
      if (read_4 === "else") {
        line_indent += 1;
        if (then_section.has(line_indent)) {
          push_text_eol(")");
          then_section.delete(line_indent);
        }
        perform_indent();
        else_section.add(block_indent);
        i = i+4;
        push_text(`(else `);
        if (code[i] === " ") {
          push_text(code[i]);
          i = i + 1;
          expr = read_line_push_comment();
          push_expr(expr);
          push_eol();
          line_indent = 0;
        }
        continue;
      }
      if (read_4 === "func") {
        perform_indent();
        if (line_indent > 0) throw `Nested func unsupported ${i}`;
        break;
      }

      if (code.slice(i, i+5) === "loop ") {
        perform_indent();
        prev_if_push();
        line = read_line_push_comment();
        push_text_eol(`(${line}`);
        block_indent += 1;
        line_indent = 0;
        continue;
      }
      if (code.slice(i, i+6) === "local ") {
        i = i+6;
        line = read_line_push_comment();
        line = line.split(" ").map(p => "(local $"+p+" i32)").join(" ");
        push_text(line);
        line_indent = 0;
        continue;
      }

      if (expr_with_const_pattern.test(code[i])) {
        perform_indent();
        prev_if_push();
        line = read_line_push_comment();
        push_expr(line);
        push_eol();
        line_indent = 0;
        continue;
      }

      throw `Parse func body unknown error at ${i} "${code[i]}"`;
    }

    while(block_indent-- > 0) {
      push_text(")");
    }
  }

  function read_line_push_comment() {
    let k = i;
    const line = read_line();
    let len = line.length;
    if (k + len < i) {
      push_text(code.slice(k + len, i));
    }
    return line;
  }

  function push_line() {
    let k = i;
    for (;i < len; i++) {
      if (code[i] === "\n") {
        ++i;
        break;
      }
    }
    push_text(code.slice(k, i));
  }

  function go_after_close_bracket() {
    let d = 1;
    while(i < len) {
      if (code[i] === "(") d++;
      if (code[i] === ")") d--;
      ++i;
      if (!d) break;
    }
  }

  function cut_index(k) {
    prev_push_index = k;
  }

  function push_expr(text) {
    push_text(expr_to_wat(text));
  }

  function push_text(text) {
    if (exclude_section_deep) return;
    out.push(text);
  }

  function push_eol() {
    push_text("\n");
  }

  function push_text_eol(text) {
    push_text(text);
    push_eol();
  }

  function push_index(k) {
    k = Math.min(Math.max(0, k), len-1);
    if (k === prev_push_index) return;
    push_text(code.slice(prev_push_index, k));
    prev_push_index = k;
  }

  function push_comment_block(text) {
    push_text(`(;;${text};;)`);
  }

  function push_func_def(text) {
    const func_pattern = /^func ([a-z_][a-z_0-9]+) ?(?:\(([^\)]+)\))? ?(result)?$/m;
    let m;
    if (m = func_pattern.exec(text)) {
      let [_, name, params, result] = m;
      let text = "(func $" + name + " ";
      if (params) {
        text += params.split(" ").map(p => "(param $"+p+" i32)").join(" ");
      }
      if (result) {
        text += " (result i32)";
      }
      push_text(text);
    }
  }

  function push_preprocess_section(text) {
    const xml_pattern = /^<([^\>]+)>$/m;
    const import_pattern = /^import (.+)$/m;

    let m;
    if (m = import_pattern.exec(text)) {
      const [_, import_path] = m;
      push_text(import_node_compile(import_path, dirname));
    }
    else if (m = xml_pattern.exec(text)) {
      const [_, tag] = m;
      switch(tag) {
        case "debug":
          if (!process.env.REALAR_DEV) exclude_section_deep += 1;
          break;
        case "/debug":
          if (!process.env.REALAR_DEV) exclude_section_deep -= 1;
          break;
        default:
          throw `Unexpected preprocessor xml tag ${tag}`;
      }
    }
    else {
      throw `Unexpected preprocessor command "${text}"`
    }
  }
}

function import_node_compile(import_path, dirname) {
  let
    import_filepath = path.resolve(dirname, import_path + import_path_ext),
    import_dirname = path.dirname(import_filepath),
    import_code = fs.readFileSync(import_filepath, "utf8");

  return full_compile(import_code, import_dirname);
}

function full_compile(code, dirname) {
  return compile(
    sharp_sharp_comment_compile(
      define_compile(code)
    ),
    dirname
  );
}

function sharp_sharp_comment_compile(code) {
  const pattern = /([^#])#([^#])/mg;
  return code.replace(pattern, (_, prefix, suffix) => prefix + ";;" + suffix);
}

function define_compile(code) {
  let consts = new Map();

  let list = [];

  const define_pattern = /^## define ([A-Z_][A-Z_0-9]*) ([1-9][0-9]*)/gm;
  code = code.replace(
    define_pattern,
    (match, name, value) => {
      consts.set(name, value);
      let i = list.push(match) - 1;
      return `(;;%%${i}%%;;)`;
    }
  );

  const const_name_pattern = /(^|[^a-zA-Z0-9_])([A-Z_][A-Z_0-9]*)/gm;
  code = code.replace(
    const_name_pattern,
    (match, prefix, name) => consts.has(name) ? prefix + consts.get(name) : match
  );

  const list_pattern = /%%([0-9]+)%%/gm;
  code = code.replace(
    list_pattern,
    (_, i) => list[i]
  );

  return code;
}

// <debug>
function slice_code_lines(code, from, to) {
  const lines = code.split("\n");
  return lines.slice(from, to).map((t, i) => `${from + i}: ${t}`).join("\n");
}
// </debug

function preprocess(code, dirname) {
  code = full_compile(code, dirname);
  // console.log(slice_code_lines(code, 80, 120));
  // throw "debug";
  return code;
}
