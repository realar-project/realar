const
  { expr_to_wat } = require("./expr");

const
  TEXT_NODE = 1,
  XML_NODE = 2,
  EXPR_NODE = 3;

let
  code = `
  (some start)
  (;;$i = 30;;)
(;;<debug>;;)(some code)
  (;;$i = 10;;)
(;;</debug>;;)
(;;<debug>;;)(;;$i = 11;;)(;;</debug>;;)
(some finish)
  `;

module.exports = {
  preprocess
};

function tree(code) {
  const brackets = /\(;;(.*?);;\)/gm;
  const xml_test = /^<(.*)>$/m;

  let tree = [];
  let m;
  let last_index = 0;
  while(m = brackets.exec(code)) {
    const
      index = m.index,
      [ match, text ] = m;

    if (last_index !== index) {
      tree.push([
        TEXT_NODE,
        code.slice(last_index, index).trim()
      ]);
    }
    tree.push([
      xml_test.test(text) ? XML_NODE : EXPR_NODE,
      text.trim()
    ]);

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

function flatten(tree) {
  let res = [];
  for (const [type, text] of tree) {
    if (type === TEXT_NODE) {
      res.push(text);
    }
  }
  return res.join("");
}

function preprocess() {
  // TODO: preprocess and process
  // (;;<debug>;;) (;;</debug>;;) -> xml
  // mathematic
  code = flatten(expr(xml(tree(code))));
  console.log(code);
  return code;
}
