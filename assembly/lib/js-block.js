module.exports = {
  module_js_block,
  common_js_block
};

function env_log_debug() {
  if (!process.env.REALAR_DEV) return `{
    abort() {
      throw Error("Abort!");
    }
  }`;
  return `(function() {
    // @see https://github.com/AssemblyScript/assemblyscript/blob/e2f5ad9fe94190cd232848c4162636e259cc68ee/lib/loader/index.js#L44

    // Runtime header offsets
    const SIZE_OFFSET = -4;

    // Runtime type information
    const CHUNKSIZE = 1024;

    /** Gets a string from an U32 and an U16 view on a memory. */
    function getStringImpl(buffer, ptr) {
      const U32 = new Uint32Array(buffer);
      const U16 = new Uint16Array(buffer);
      let length = U32[ptr + SIZE_OFFSET >>> 2] >>> 1;
      let offset = ptr >>> 1;
      if (length <= CHUNKSIZE) return String.fromCharCode.apply(String, U16.subarray(offset, offset + length));
      let parts = '';
      do {
        const last = U16[offset + CHUNKSIZE - 1];
        const size = last >= 0xD800 && last < 0xDC00 ? CHUNKSIZE - 1 : CHUNKSIZE;
        parts += String.fromCharCode.apply(String, U16.subarray(offset, offset += size));
        length -= size;
      } while (length > CHUNKSIZE);
      return parts + String.fromCharCode.apply(String, U16.subarray(offset, offset + length));
    }
    function getString(ptr) {
      const memory = inst_exports.memory;;
      return getStringImpl(memory.buffer, ptr);
    }
    function abort(msg, file, line, colm) {
      throw Error(\`abort: \${getString(msg)} at \${getString(file)}:\${line}:\${colm}\`);
    }
    function log(msg, ...vals) {
      console.log(getString(msg), ...vals);
    }
    return {
      abort,
      log
    }
  })()`
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
  let inst_exports;
  let env_log_debug = ${env_log_debug()};
  let imports = {
    env: env_log_debug
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
    return (inst_exports = inst.exports);
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
  return `"${list.join(`"+\n"`)}" /*${buf.length}:${src.length}*/`;
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
