import { entry_start, entry_finish } from "./box";
import { unlink_array_exclude } from "./link";
import { get_mock } from "./test";

let
  event_seq_current = 0,
  events = new Map(),
  event_listeners = new Map(),
  id_key = Symbol("id"),
  uniq_prefix = "%event-";

export {
  event,
  is_event_uniq,
  resolve_event_uniq,
  event_listen
}

function event_seq_next() {
  return ++event_seq_current;
}

function event_uniq(id) {
  return uniq_prefix + id;
}

function event() {
  const
    id = event_seq_next(),
    uniq = event_uniq(id);

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
      entry_start();
      for (const fn of listeners.slice()) fn.apply(null, arguments);
      entry_finish();
    }

    resolve(Array.prototype.slice.call(arguments));
    promisify();
  };
  fn.toString = () => uniq;
  fn[id_key] = id;
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

function is_event_uniq(uniq) {
  return uniq.slice(0, uniq_prefix.length) === uniq_prefix;
}

function resolve_event_uniq(uniq) {
  return +uniq.slice(uniq_prefix.length);
}

function event_listen(id, listener) {
  let listeners = event_listeners.get(id);
  if (!listeners) {
    event_listeners.set(id, (listeners = []));
  }
  listeners.push(listener);
  unlink_array_exclude(listeners, listener);
}
