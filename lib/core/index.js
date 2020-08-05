import core_factory from "./u32/index.u32";

const [ core, fns ] = make();
const {
  push, pop
} = core;

export {
  core,
  push, pop,
  fns
};

function make() {
  // const time = Date.now();
  const fns = new WebAssembly.Table({
    initial: 1,
    element: "anyfunc"
  });
  const core = core_factory({ error, fns });
  // console.log("u32:", Date.now() - time);
  core.start();
  return [ core, fns ];
}

function error(code) {
  let msg = "Unknown error";
  switch(code) {
    case 1: // TICK_DEEP_LIMIT_EXCEPTION
      msg = "Tick deep limit exception";
  }
  throw new Error(msg);
}
