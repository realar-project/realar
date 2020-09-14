import { box_entry_start, box_entry_finish, core } from "./core";
import { unlink_array_exclude } from "./link";
import { get_mock } from "./test";

let
  event_seq_current = 0,
  events = new Map(),
  event_listeners = new Map(),
  event_key = Symbol();

export {
  event,
  event_key,
  event_listen
}

function event_seq_next() {
  return ++event_seq_current;
}

function event() {
  const id = event_seq_next();
  let
    resolve = null,
    promise;

  const fn = function() {
    const mock = get_mock(fn);
    if (mock) {
      fn.apply(this, arguments);
      return;
    }

    const listeners = event_listeners.get(id);
    if (listeners) {
      core[box_entry_start]();
      for (const fn of listeners.slice()) fn.apply(null, arguments);
      core[box_entry_finish]();
    }

    promisify();
    resolve(Array.prototype.slice.call(arguments));
  };
  fn[event_key] = id;
  events.set(id, fn);

  promisify();

  function promisify() {
    promise = new Promise(r => (resolve = r));
    for (const k of ["then", "catch", "finally"]) {
      fn[k] = promise[k].bind(promise);
    }
  }

  return fn;
}

function event_listen(id, listener) {
  let listeners = event_listeners.get(id);
  if (!listeners) {
    event_listeners.set(id, (listeners = []));
  }
  listeners.push(listener);
  unlink_array_exclude(listeners, listener);
}
