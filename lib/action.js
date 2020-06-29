import { entry_start, entry_finish } from "./box";
import { unlink_array_exclude } from "./link";
import { get_mock } from "./mock";

let
  action_seq_current = 0,
  actions = new Map(),
  action_listeners = new Map(),
  id_key = Symbol("id"),
  uniq_prefix = "%action-";

export {
  action,
  is_action_uniq,
  resolve_action_uniq,
  action_listen
}

function action_seq_next() {
  return ++action_seq_current;
}

function action_uniq(id) {
  return uniq_prefix + id;
}

function action() {
  const id = action_seq_next();
  const uniq = action_uniq(id);
  const fn = function() {
    const mock = get_mock(fn);
    if (mock) {
      fn.apply(this, arguments);
      return;
    }

    const listeners = action_listeners.get(id);
    if (listeners) {
      entry_start();
      for (const fn of listeners.slice()) fn.apply(null, arguments);
      entry_finish();
    }
  };
  fn.toString = () => uniq;
  fn[id_key] = id;
  actions.set(id, fn);
  return fn;
}

function is_action_uniq(uniq) {
  return uniq.slice(0, uniq_prefix.length) === uniq_prefix;
}

function resolve_action_uniq(uniq) {
  return +uniq.slice(uniq_prefix.length);
}

function action_listen(id, listener) {
  let listeners = action_listeners.get(id);
  if (!listeners) {
    action_listeners.set(id, (listeners = []));
  }
  listeners.push(listener);
  unlink_array_exclude(listeners, listener);
}
