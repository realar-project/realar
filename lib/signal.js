import { box_entry_start, box_entry_finish, core } from "./core";
import { unlink_array_exclude } from "./link";
import { get_mock } from "./test";

let
  signal_seq_current = 0,
  signals = new Map(),
  signal_listeners = new Map(),
  signal_tuples = new Map(),
  signal_key = Symbol();

export {
  signal,
  signal_key,
  signal_listen
}

function signal_seq_next() {
  return ++signal_seq_current;
}

function signal() {
  const id = signal_seq_next();
  let tuple = Array.prototype.slice.call(arguments);
  signal_tuples.set(id, tuple);

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
      core[box_entry_start]();
      for (const fn of listeners.slice()) fn.apply(null, tuple);
      core[box_entry_finish]();
    }
  };
  fn[signal_key] = id;
  signals.set(id, fn);

  fn.then = fn.catch = fn.finally = (fn) => (
    Promise.resolve(
      fn.apply(null, signal_tuples.get(id))
    )
  );

  return fn;
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
