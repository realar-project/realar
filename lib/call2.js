import { box_entry_start, box_entry_finish, core } from "./core";
import { unlink_map_exclude } from "./link2";
import { get_mock } from "./test";

let
  call_seq_current = 0,
  calls = new Map(),
  call_listeners = new Map(),
  call_key = Symbol();

export {
  call,
  call_key,
  call_listen
}

function call_seq_next() {
  return ++call_seq_current;
}

function call() {
  const id = call_seq_next();

  const fn = function() {
    const mock = get_mock(fn);
    if (mock) return fn.apply(this, arguments);

    const listener = call_listeners.get(id);
    if (listener) {
      core[box_entry_start]();
      const res = listener.apply(null, arguments);
      core[box_entry_finish]();
      return res;
    }
  };
  fn[call_key] = id;
  calls.set(id, fn);
  return fn;
}

function call_listen(id, listener) {
  if (call_listeners.has(id)) {
    throw new Error("Supported only one listener for call");
  }
  call_listeners.set(id, listener);
  unlink_map_exclude(call_listeners, id);
}
