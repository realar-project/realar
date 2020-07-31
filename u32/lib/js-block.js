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
    env: {
      log_i32() {
        console.log.apply(console, ["core:"].concat([].slice.call(arguments)))
      },
      log_mem(ptr, size) {
        console.log("core:", ptr, size,
          Array.from(new Uint32Array(instance.exports.memory.buffer, ptr << 2, size))
        )
      }
    }
  }
  if (env) {
    Object.assign(imports.env, env)
  }
  let mod = new WebAssembly.Module(buf)
  let instance = new WebAssembly.Instance(mod, imports)
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
