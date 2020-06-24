let action_seq_current = 0,
  actions = new Map(),
  action_listeners = new Map(),
  symbol_id = Symbol("id"),
  uniq_prefix = "%action-";

function action_seq_next() {
  return ++action_seq_current;
}

function action_uniq(id) {
  return uniq_prefix + id;
}

export function action() {
  const id = action_seq_next();
  const uniq = action_uniq(id);
  const fn = function() {
    const listeners = action_listeners.get(id);
    if (listeners) {
      for (const fn of listeners.slice()) fn.apply(null, arguments);
    }
  };
  fn.toString = () => uniq;
  fn[symbol_id] = id;
  actions.set(id, fn);
  return fn;
}

export function is_action_uniq(uniq) {
  return uniq.slice(0, uniq_prefix.length) === uniq_prefix;
}

export function resolve_action_uniq(uniq) {
  return +uniq.slice(uniq_prefix.length);
}

export function action_listen(id, listener) {
  let listeners = action_listeners.get(id);
  if (!listeners) {
    action_listeners.set(id, (listeners = []));
  }
  listeners.push(listener);
}
