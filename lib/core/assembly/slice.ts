import { box_init, box_slice_push, box_slice_pop } from "./box";
import { seq_init, seq_slice_push, seq_slice_pop } from "./seq";

export {
  start,
  push,
  pop
}

function start(): void {
  seq_init();
  box_init();
}

function push(): void {
  seq_slice_push();
  box_slice_push();
}
function pop(): void {
  seq_slice_pop();
  box_slice_pop();
}
