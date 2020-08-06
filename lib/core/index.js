import core_factory from "./u32/index.u32";

let core = make();
let fns = new Map();

export {
  core,
  fns
};

function make() {
  // const time = Date.now();
  const core = core_factory({ call, error });
  // console.log("u32:", Date.now() - time);
  core.start();
  return core;
}

function error(code) {
  let msg = "Unknown error";
  switch(code) {
    case 1: // TICK_DEEP_LIMIT_EXCEPTION
      msg = "Tick deep limit exception";
  }
  throw new Error(msg);
}

function call(key) {
  fns.get(key)();
}
