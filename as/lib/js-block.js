module.exports = {
  module_js_block,
  common_js_block
};

function tpl(src_block, export_prefix) {
  return `
${export_prefix} function(env) {
  let src = ${src_block}
  let buf
  let isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null
  if (isNode) {
    buf = Buffer.from(src, "base64")
  } else {
    let raw = atob(src)
    let len = raw.length
    buf = new Uint8Array(len)
    for(var i = 0; i < len; i++) {
      buf[i] = raw.charCodeAt(i)
    }
  }
  let imports = {
    env: {}
  }
  if (env) {
    Object.assign(imports.env, env)
  }
  if(buf.length > 4096) {
    return WebAssembly.instantiate(buf, imports).then(results => make_result(results.instance))
  }
  return make_result(
    new WebAssembly.Instance(
      new WebAssembly.Module(buf),
      imports
    )
  )

  function make_result(inst) {
    return inst.exports
  }
}`;
}

function buf_to_js(buf) {
  const src = buf.toString("base64");
  const S = 64;
  const list = [];
  const rows = Math.floor(src.length / S);
  for (let i = 0; i < rows; i++) {
    list.push(src.slice(i*S, i*S+S));
  }
  const last = src.length % S;
  if (last) {
    list.push(src.slice(S*rows));
  }
  return `"${list.join(`"+\n"`)}" /*${buf.length}*/`;
}

function common_js_block(buf) {
  return tpl(
    buf_to_js(buf),
    "module.exports ="
  );
}

function module_js_block(buf) {
  return tpl(
    buf_to_js(buf),
    "export default"
  );
}
