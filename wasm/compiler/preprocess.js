const
  fs = require("fs"),
  path = require("path"),
  { expr_to_wat, define_const_map } = require("./expr");

const
  TEXT_NODE = 1,
  XML_NODE = 2,
  EXPR_NODE = 3,
  IMPORT_NODE = 4,
  DEFINE_NODE = 5;

const
  import_path_ext = ".wat";

let
  context_define_const;

module.exports = {
  preprocess
};

function tree(code) {
  const brackets_pattern = /\(;;(.*?);;\)/gm;
  const xml_test = /^<(.*)>$/m;
  const import_pattern = /^import (.+)$/m;
  const define_pattern = /^define ([A-Z_][A-Z_0-9]*) ([1-9][0-9]*)$/m

  let tree = [];
  let m;
  let last_index = 0;
  while(m = brackets_pattern.exec(code)) {
    const
      index = m.index,
      [ match, text ] = m;

    if (last_index !== index) {
      tree.push([
        TEXT_NODE,
        code.slice(last_index, index)
      ]);
    }
    if (m = import_pattern.exec(text)) {
      tree.push([
        IMPORT_NODE,
        m[1]  // filename
      ]);
    }
    else if (m = define_pattern.exec(text)) {
      tree.push([
        DEFINE_NODE,
        m[1], // name
        m[2]  // value
      ]);
    }
    else if (xml_test.test(text)) {
      tree.push([
        XML_NODE,
        text.trim()
      ]);
    }
    else {
      tree.push([
        TEXT_NODE,
        match
      ]);
      tree.push([
        EXPR_NODE,
        text.trim()
      ]);
    }

    last_index = index + match.length;
  }
  tree.push([
    TEXT_NODE,
    code.slice(last_index).trim()
  ]);
  return tree;
}

function xml(tree) {
  const len = tree.length;
  let out = [];
  let debug_section_index = 0;
  for (let i = 0; i < len; i++) {
    const [type, text] = tree[i];
    if (type === XML_NODE) {
      if (text === "<debug>") {
        if (!process.env.REALAR_DEV) {
          debug_section_index = i;
        }
        continue;
      }
      if (text === "</debug>") {
        debug_section_index = 0;
        continue;
      }
    }
    if (debug_section_index) continue;
    out.push(tree[i]);
  }
  return out;
}

function expr(tree) {
  const len = tree.length;
  let out = [];
  for (let i = 0; i < len; i++) {
    const [type, text] = tree[i];
    if (type === EXPR_NODE) {
      out.push([
        TEXT_NODE,
        expr_to_wat(text)
      ])
      continue;
    }
    out.push(tree[i]);
  }

  return out;
}

function import_node(tree, dirname) {
  let out = [];
  for (const node of tree) {
    const [type, import_path] = node;
    if (type === IMPORT_NODE) {
      out.push(
        ...import_node_compile(import_path, dirname)
      );
    }
    else {
      out.push(node);
    }
  }
  return out;
}

function import_node_compile(import_path, dirname) {
  let
    import_filepath = path.resolve(dirname, import_path + import_path_ext),
    import_dirname = path.dirname(import_filepath),
    import_code = fs.readFileSync(import_filepath, "utf8");

  return compile(import_code, import_dirname);
}

function define_node(tree) {
  let out = [];
  for (const node of tree) {
    const [type, text, const_val] = node;
    if (type === DEFINE_NODE) {
      context_define_const.set(text, const_val);
    }
    else if (type === EXPR_NODE) {
      out.push([
        type,
        define_node_process(text)
      ]);
    } else {
      out.push(node);
    }
  }
  return out;
}

function define_node_process(text) {
  const const_name_pattern = /[A-Z_][A-Z_0-9]*/gm;
  return text.replace(
    const_name_pattern,
    m => context_define_const.get(m)
  );
}

function compile(code, dirname) {
  return expr(
    define_node(
      xml(
        import_node(
          tree(code),
          dirname
        )
      )
    )
  );
}

function flatten(tree) {
  let out = [];
  for (const [type, text] of tree) {
    if (type === TEXT_NODE) {
      out.push(text);
    }
  }
  return out.join("");
}

function preprocess(code, dirname) {
  context_define_const = new Map();
  return flatten(compile(code, dirname));
}
