import { box_init } from "./box";

let slice_current: i32;

export {
  start,
  push,
  pop
}

function start(): void {
  slice_init();
  each_slice_init();
}

function each_slice_init(): void {
  box_init();
}

function slice_init(): void {
  slice_current = 0
}

function push(): void {
}
function pop(): void {
}
