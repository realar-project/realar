import { entry_start, entry_finish } from "./box";
import { unlink_map_exclude } from "./link";
import { get_mock } from "./mock";

let
  call_seq_current = 0,
  calls = new Map(),
  call_listeners = new Map(),
  id_key = Symbol("id"),
  uniq_prefix = "%call-";

export {
  call,
  is_call_uniq,
  resolve_call_uniq,
  call_listen
}

function call_seq_next() {
  return ++call_seq_current;
}

function call_uniq(id) {
  return uniq_prefix + id;
}

function call() {
  const id = call_seq_next();
  const uniq = call_uniq(id);
  const fn = function() {
    const mock = get_mock(fn);
    if (mock) return fn.apply(this, arguments);

    const listener = call_listeners.get(id);
    if (listener) {
      entry_start();
      const res = listener.apply(null, arguments);
      entry_finish();
      return res;
    }
  };
  fn.toString = () => uniq;
  fn[id_key] = id;
  calls.set(id, fn);
  return fn;
}

function is_call_uniq(uniq) {
  return uniq.slice(0, uniq_prefix.length) === uniq_prefix;
}

function resolve_call_uniq(uniq) {
  return +uniq.slice(uniq_prefix.length);
}

function call_listen(id, listener) {
  if (call_listeners.has(id)) {
    throw new Error("Supported just one listener for call");
  }
  call_listeners.set(id, listener);
  unlink_map_exclude(call_listeners, id);
}
