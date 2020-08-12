module.exports = {
  module_js_block,
  common_js_block
};

function env_log_debug() {
  if (!process.env.REALAR_DEV) return '';
  return `(function() {
    function log(...args) {
      console.log(...args)
    }
    function extract_ptr(ptr, size) {
      let { memory } = inst_exports
      if (size === 0) return []
      return Array.from(
        new Uint32Array(
          memory.buffer, ptr * 4, size
        )
      )
    }
    function extract_set(id) {
      let { set_size, set_data_ptr } = inst_exports
      let size = set_size(id)
      return extract_ptr(set_data_ptr(id), size)
    }
    function log_set(id) {
      log("s", extract_set(id))
    }
    function extract_arr(id) {
      let { arr_len, arr_data_ptr } = inst_exports
      let size = arr_len(id)
      return extract_ptr(arr_data_ptr(id), size)
    }
    function log_arr(id) {
      log("a", extract_arr(id))
    }
    function extract_map(id) {
      let { map_keys, map_values } = inst_exports
      let keys = extract_set(map_keys(id))
      let values = extract_arr(map_values(id))
      if (keys.length !== values.length) {
        console.error("Broken map:", "keys:", keys, "values:", values)
        throw new Error("Map has different length of keys set and values array")
      }
      return keys.map((k, i) => [k, values[i]])
    }
    function log_map(id) {
      log("m", extract_map(id).map(p => p.join(":")))
    }
    function extract_map_of_arr(id) {
      let map = extract_map(id)
      let res = []
      for (const [k, v] of map) {
        res.push([k, extract_arr(v)])
      }
      return res
    }
    function log_map_of_arr(id) {
      log("m:a", extract_map_of_arr(id).map(([k, arr]) => k + ":" + arr.join(",")))
    }
    function log_mem(ptr, size) {
      log(extract_ptr(ptr, size))
    }
    function log_mem_map() {
      let { get_mem_map } = inst_exports
      let id = get_mem_map()
      if (!id) {
        console.log("mem:", 0)
      } else {
        try {
          log("mem:", extract_map_of_arr(id).map(([k, arr]) => k + ":" + arr.join(",")))
        } catch (e) {
          log("mem:!")
          throw e
        }
      }
    }

    return {
      log,
      log_set,
      log_arr,
      log_map,
      log_map_of_arr,
      log_mem,
      log_mem_map,
      extract_ptr,
      extract_set,
      extract_arr,
      extract_map,
      extract_map_of_arr,
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
  let inst_exports
  let env_log_debug = ${env_log_debug()}
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
    inst_exports = Object.assign(
      {},
      env_log_debug,
      inst.exports
    );
    return inst_exports
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
