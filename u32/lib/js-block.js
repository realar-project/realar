module.exports = {
  module_js_block,
  common_js_block
};

function env_log_debug() {
  if (!process.env.REALAR_DEV) return '';
  return `
  log_i32(...args) {
    console.log(...args)
  },
  log_mem(...args) {
    const mems = []
    for (let i = 0; i < args.length; i++) {
      mems.push(
        Array.from(new Uint32Array(instance.exports.memory.buffer, args[i] << 2, args[++i]))
      )
    }
    console.log(...mems)
  }
  `
}

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
  let instance
  let imports = {
    env: {${env_log_debug()}}
  }
  if (env) {
    Object.assign(imports.env, env)
  }
  if(buf.length > 4096) {
    return WebAssembly.instantiate(buf, imports).then(results => (instance = results.instance).exports)
  }
  instance = new WebAssembly.Instance(
    new WebAssembly.Module(buf),
    imports
  );
  return instance.exports
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
  return `"${list.join(`"+\n"`)}" /*${src.length}*/`;
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
