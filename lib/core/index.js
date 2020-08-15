import core_factory from "./assembly/index.ts";

let
  core = make(),
/*#if DEBUG
  fns_map = new Map(),
//#else */
  fns = new Map(),
//#endif
  fns_stack = []
;

/*#if DEBUG
let fns = {
  get(k) {
    const r = fns_map.get(k);
    // console.log("FNS.GET", k, r);
    return r;
  },
  clear: () => fns_map.clear(),
  set(k, v) {
    const r = fns_map.set(k, v);
    // console.log("FNS.SET", k, v, r);
    return v;
  },
  forEach(fn) {
    fns_map.forEach(fn);
  }
}
//#endif */

export {
  core,
  fns,
  push,
  pop,
  ready
};

function push() {
  core.push();
  fns_stack.push(new Map(
/*#if DEBUG
    fns_map
//#else */
    fns
//#endif
  ));
  fns.clear();
}

function pop() {
  core.pop();
  fns.clear();
  fns_stack.pop().forEach((v, k) => fns.set(k, v));
}

function ready(fn) {
  if (core.w) {
    core.w.then(fn);
  } else {
    fn();
  }
}

function make() {
  // const time = Date.now();
  let core = core_factory({ call, error });
  // console.log("core:", Date.now() - time);
  if (core.then) {
    let _core = core;
    core = {
      w: _core.then(inst => {
        Object.keys(inst).forEach(key => core[key] = inst[key]);
        core.w = 0;
        core.start();
        return core;
      })
    };
  } else {
    core.start();
  }
/*#if DEBUG
  return get_lazy_core_debug_proxy(core);
//#else */
  return core;
//#endif
}

/*#if DEBUG
function get_lazy_core_debug_proxy(core) {
  return new Proxy({}, {
    get(_target, prop, _receiver) {
      if (prop === "w") {
        return core.w;
      }
      return function() {
        const ret = core[prop].apply(core, arguments);
        // console.log(
        //   ">",
        //   prop,
        //   Array.prototype.slice.call(arguments),
        //   ret
        // );
        return ret;
      }
    }
  });
}
//#endif */

function error(code) {
  let msg = "Unknown error";
  switch(code) {
    case 1: // TICK_DEEP_LIMIT_EXCEPTION
      msg = "Tick deep limit exception";
      break;
    case 2: // DIGEST_LOOP_LIMIT_EXCEPTION
      mag = "Limit digest loop iteration";
      break;
  }
  throw new Error(msg);
}

function call(key) {
  fns.get(key)();
}
