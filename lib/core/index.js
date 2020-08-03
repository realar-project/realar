import core_factory from "./u32/index.u32";

const
  TICK_DEEP_LIMIT_EXCEPTION = 1
;

const core = make();
const {
  push, pop
} = core;

export {
  core,
  push, pop
};

function make() {
  // const time = Date.now();
  const core = core_factory({ error });
  // console.log("u32:", Date.now() - time);
  core.start();
  return core;
}

function error(code) {
  let msg = "Unknown error";
  switch(code) {
    case TICK_DEEP_LIMIT_EXCEPTION:
      msg = "Tick deep limit exception";
  }
  throw new Error(msg);
}
