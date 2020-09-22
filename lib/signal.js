import { box_entry_start, box_entry_finish, core } from "./core";
import { unlink_array_exclude } from "./link";
import { get_mock } from "./test";

let
  signal_seq_current = 0,
  signals = new Map(),
  signal_listeners = new Map(),
  signal_args = new Map(),
  signal_key = Symbol();

export {
  signal,
  signal_key,
  signal_listen
}

function signal_seq_next() {
  return ++signal_seq_current;
}

function signal(arg) {
  const id = signal_seq_next();
  signal_args.set(id, arg);

  const fn = function(arg) {
    const mock = get_mock(fn);
    if (mock) return mock.call(this, arg);

    let prev = signal_args.get(id);
    if (Object.is(prev, arg)) return;

    signal_args.set(id, arg);
    const listeners = signal_listeners.get(id);
    if (listeners) {
      core[box_entry_start]();
      for (const listener of listeners.slice()) listener(arg);
      core[box_entry_finish]();
    }
  };
  fn[signal_key] = id;
  signals.set(id, fn);

  fn.then = fn.catch = fn.finally = (done) => (
    Promise.resolve(
      done(signal_args.get(id))
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
  listener(signal_args.get(id));
}
