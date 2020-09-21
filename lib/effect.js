import { unlink_fn } from "./link";

export {
  effect
}

function effect(fn) {
  unlink_fn(fn());
}
