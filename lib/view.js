import {
  receiver,
  receiver_close,
  receiver_free,
  receiver_open,
  receiver_reset,
  tick_start,
  tick_finish
} from "./box";
import { Meta } from "./unit";
import { link, unlink } from "./link";

let render_phase = 0;
const start_render_phase = () => {
  if (!render_phase) {
    render_phase = 1;
    setTimeout(() => (render_phase = 0));
  }
};

export function view(unit, sync) {
  if (!unit[Meta]) throw new Error("Only unit supported");

  link(unit);
  const id = receiver(sync);

  const [meta_keys, meta_views] = unit[Meta];
  const descriptors = {};

  const views = [];

  for (const prop of Object.keys(meta_keys)) {
    const key = meta_keys[prop];
    const descriptor = {};

    switch (key) {
      /* eslint-disable no-loop-func*/
      case "call":
        descriptor.value = () => {
          if (render_phase) receiver_open(id);
          else tick_start();
          const res = unit[prop].apply(unit, arguments);
          if (render_phase) receiver_close(id);
          else tick_finish();
          return res;
        };
        break;
      case "get":
        descriptor.get = () => {
          if (render_phase) receiver_open(id);
          else tick_start();
          const val = unit[prop];
          if (render_phase) receiver_close(id);
          else tick_finish();
          return val;
        };
        break;
      case "view":
        let view_key = 0;
        descriptor.get = () => {
          if (!view_key) {
            view_key = views.push(meta_views[prop](sync));
          }
          return views[view_key - 1].inst;
        };
        break;
      default:
    }
    descriptors[prop] = descriptor;
  }

  const inst = Object.freeze(Object.defineProperties({}, descriptors));

  return {
    inst,
    render() {
      start_render_phase();
      receiver_reset(id);
      for (const { render } of views) render();
    },
    unlink() {
      receiver_free(id);
      unlink(unit);
      for (const { unlink } of views) unlink();
    }
  };
}
