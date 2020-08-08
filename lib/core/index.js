import core_factory from "./u32/index.u32";

let
  core = make(),
  fns_map = new Map(),
  fns_stack = []
;

let fns = {
  get(k) {
    const r = fns_map.get(k);
    console.log("FNS.GET", k, r);
    return r;
  },
  clear: () => fns_map.clear(),
  set(k, v) {
    const r = fns_map.set(k, v);
    console.log("FNS.SET", k, v, r);
    return v;
  },
  forEach(fn) {
    fns_map.forEach(fn);
  }
}

export {
  core,
  fns,
  push,
  pop,
  wait_core_instantiate
};

function push() {
  core.push();
  fns_stack.push(new Map(fns));
  fns.clear();
}

function pop() {
  core.pop();
  fns.clear();
  fns_stack.pop().forEach((v, k) => fns.set(k, v));
}

function wait_core_instantiate(fn) {
  if (core.wait_instantiate) {
    core.wait_instantiate.then(fn);
  } else {
    fn();
  }
}

function make() {
  // const time = Date.now();
  let core = core_factory({ call, error });
  // console.log("u32:", Date.now() - time);
  if (core.then) {
    let _core = core;
    core = {
      wait_instantiate: _core.then(inst => {
        Object.keys(inst).forEach(key => core[key] = inst[key]);
        core.wait_instantiate = 0;
        return core;
      })
    };
  }
  return core;
}

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
