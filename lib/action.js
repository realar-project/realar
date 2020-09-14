import { box_entry_start, box_entry_finish, core } from "./core";
import { unlink_array_exclude } from "./link";
import { get_mock } from "./test";

let
  action_seq_current = 0,
  actions = new Map(),
  action_listeners = new Map(),
  action_key = Symbol();

export {
  action,
  action_key,
  action_listen
}

function action_seq_next() {
  return ++action_seq_current;
}

function action() {
  const id = action_seq_next();
  let
    resolve = null,
    promise;

  const fn = function() {
    const mock = get_mock(fn);
    if (mock) {
      fn.apply(this, arguments);
      return;
    }

    const listeners = action_listeners.get(id);
    if (listeners) {
      core[box_entry_start]();
      for (const fn of listeners.slice()) fn.apply(null, arguments);
      core[box_entry_finish]();
    }

    promisify();
    resolve(Array.prototype.slice.call(arguments));
  };
  fn[action_key] = id;
  actions.set(id, fn);

  promisify();

  function promisify() {
    promise = new Promise(r => (resolve = r));
    for (const k of ["then", "catch", "finally"]) {
      fn[k] = promise[k].bind(promise);
    }
  }

  return fn;
}

function action_listen(id, listener) {
  let listeners = action_listeners.get(id);
  if (!listeners) {
    action_listeners.set(id, (listeners = []));
  }
  listeners.push(listener);
  unlink_array_exclude(listeners, listener);
}
