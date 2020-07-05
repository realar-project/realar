import { entry_start, entry_finish } from "./box";
import { unlink_array_exclude } from "./link";
import { get_mock } from "./test";

let
  signal_seq_current = 0,
  signals = new Map(),
  signal_listeners = new Map(),
  signal_tuples = new Map(),
  id_key = Symbol("id"),
  uniq_prefix = "%signal-";

export {
  signal,
  is_signal_uniq,
  resolve_signal_uniq,
  signal_listen,
  extract_id
}

function signal_seq_next() {
  return ++signal_seq_current;
}

function signal_uniq(id) {
  return uniq_prefix + id;
}

function signal() {
  const id = signal_seq_next();
  signal_tuples.set(id, Array.prototype.slice.call(arguments));

  const uniq = signal_uniq(id);
  const fn = function() {
    const mock = get_mock(fn);
    if (mock) {
      fn.apply(this, arguments);
      return;
    }

    let tuple = Array.prototype.slice.call(arguments);
    let prev = signal_tuples.get(id);
    if (tuple.length === prev.length) {
      let len = tuple.length;
      let changed = 0;
      while(len--) {
        if (!Object.is(prev[len], tuple[len])) {
          changed = 1;
          break;
        }
      }
      if (!changed) return;
    }

    signal_tuples.set(id, tuple);
    const listeners = signal_listeners.get(id);
    if (listeners) {
      entry_start();
      for (const fn of listeners.slice()) fn.apply(null, tuple);
      entry_finish();
    }
  };
  fn.toString = () => uniq;
  fn[id_key] = id;
  signals.set(id, fn);
  return fn;
}

function extract_id(sig) {
  return sig[id_key];
}

function is_signal_uniq(uniq) {
  return uniq.slice(0, uniq_prefix.length) === uniq_prefix;
}

function resolve_signal_uniq(uniq) {
  return +uniq.slice(uniq_prefix.length);
}

function signal_listen(id, listener) {
  let listeners = signal_listeners.get(id);
  if (!listeners) {
    signal_listeners.set(id, (listeners = []));
  }
  listeners.push(listener);
  unlink_array_exclude(listeners, listener);
  listener.apply(null, signal_tuples.get(id));
}
