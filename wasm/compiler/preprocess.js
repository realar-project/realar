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
    func_tree_deep = 0,
    exclude_section_deep = 0,
    define_const = new Map();

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
      after_close_bracket();
      continue;
    }
    if (code.slice(i, i+2) === "# ") {
      push_index(i);
      const line = read_line();
      push_comment_block(line);
      push_preprocess_section(line.slice(2));
      push_eol();
      cut_index(i);
      continue;
    }
    if (code.slice(i, i+4) === "func") {
      push_index(i);
      func_tree_deep = 1;
      const line = read_line();
      push_comment_block(line);
      push_func_def(line);
      push_eol();
      cut_index(i);
      continue;
    }
    i = i + 1;
  }
  push_index(i);

  return out.join("");

  function read_line() {
    let start = i, end = i;
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
    return code.slice(start, end);
  }

  function after_close_bracket() {
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

  function push_text(text) {
    if (exclude_section_deep) return;
    out.push(text);
  }

  function push_eol() {
    push_text("\n");
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
      let text = "(func $" + name;
      if (params) {
        text += params.split(" ").map(p => "(param "+p+" i32)").join(" ");
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
    const define_pattern = /^define ([A-Z_][A-Z_0-9]*) ([1-9][0-9]*)$/m

    let m;
    if (m = import_pattern.exec(text)) {
      const [_, import_path] = m;
      const text = import_node_compile(import_path, dirname);
      // console.log("IMPORT", import_path, dirname, text);
      push_text(text);
    }
    else if (m = define_pattern.exec(text)) {
      const [_, name, value] = m;
      define_const.set(name, value);
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
      throw `Unexpected preprocessor command ${text}`
    }
  }

  function define_node_process_text(text) {
    const const_name_pattern = /(^|[^a-zA-Z0-9_])([A-Z_][A-Z_0-9]*)/gm;
    // console.log("DEFINE <", text, define_const);
    text = text.replace(
      const_name_pattern,
      (_, prefix, m) => prefix + define_const.get(m)
    );
    // console.log("DEFINE >", text);
    return text;
  }
}

function import_node_compile(import_path, dirname) {
  let
    import_filepath = path.resolve(dirname, import_path + import_path_ext),
    import_dirname = path.dirname(import_filepath),
    import_code = fs.readFileSync(import_filepath, "utf8");

  return compile(import_code, import_dirname);
}

function preprocess(code, dirname) {
  // console.log(code.slice(0, 1000));
  context_define_const = new Map();
  code = compile(code, dirname);
  console.log("-------");
  console.log(code.slice(0, 1000));
  // console.log(code);
  throw "debug";
  return code;
}
