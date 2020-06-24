let chan_seq_current = 0,
  chans = new Map(),
  chan_listeners = new Map(),
  symbol_id = Symbol("id"),
  uniq_prefix = "%chan-";

function chan_seq_next() {
  return ++chan_seq_current;
}

function chan_uniq(id) {
  return uniq_prefix + id;
}

export function chan() {
  const id = chan_seq_next();
  const uniq = chan_uniq(id);
  const fn = function() {
    const listener = chan_listeners.get(id);
    if (listener) {
      return listener.apply(null, arguments);
    }
  };
  fn.toString = () => uniq;
  fn[symbol_id] = id;
  chans.set(id, fn);
  return fn;
}

export function is_chan_uniq(uniq) {
  return uniq.slice(0, uniq_prefix.length) === uniq_prefix;
}

export function resolve_chan_uniq(uniq) {
  return +uniq.slice(uniq_prefix.length);
}

export function chan_listen(id, listener) {
  if (chan_listeners.has(id)) {
    throw new Error("Supported just one listener for chan");
  }
  chan_listeners.set(id, listener);
}
