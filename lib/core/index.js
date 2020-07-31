import core_factory from "./u32/index.u32";

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
  const core = core_factory();
  // console.log("u32:", Date.now() - time);
  core.start();
  return core;
}
