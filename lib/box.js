import { expr_start, expr_finish, expr_seq_next } from "./expr";

let box_seq_current = 0,
  box_deps = new Map(),
  box_invalid = new Set(),
  box_expr = new Map(),
  slice_deps = new Set(), // null
  slice_current_id = 0,
  slice_deps_stack = [],
  tick_changed = new Set(), // null
  tick_deep = 0,
  receiver_deps = new Map(),
  receiver_notify = new Map();

export function tick_start() {
  if (!tick_deep) tick_changed = new Set();
  ++tick_deep;
}

function box_deep_invalidate(next_bound) {
  let bound;
  do {
    bound = next_bound;
    next_bound = new Set();

    for (const x of bound) {
      for (const [id, deps] of box_deps) {
        if (deps.has(x)) {
          box_invalid.add(id);
          next_bound.add(id);
        }
      }
    }
  } while (next_bound.size);
}

export function tick_finish() {
  if (--tick_deep) return;
  if (!tick_changed.size) return;

  box_deep_invalidate(tick_changed);

  let limit = 10;
  let tick_changed_size;
  do {
    if (limit-- === 0) {
      throw new Error("Limit digest loop iteration");
    }

    const changed = new Set(tick_changed);
    tick_changed = new Set();

    for (const [id, expr] of new Map(box_expr)) {
      const deps = box_deps.get(id);
      if (!deps) continue;
      for (const d of deps) {
        if (changed.has(d) || box_invalid.has(d)) {
          expr();
        }
      }
    }

    for (const [id, notify] of new Map(receiver_notify)) {
      const deps = receiver_deps.get(id);
      if (!deps) continue;
      for (const d of deps) {
        if (changed.has(d) || box_invalid.has(d)) {
          notify();
        }
      }
    }

    tick_changed_size = tick_changed.size;
    if (tick_changed_size) box_deep_invalidate(tick_changed);
  } while (tick_changed_size);
}

function box_seq_next() {
  return ++box_seq_current;
}

function slice_deps_open(id) {
  slice_deps_stack.push([slice_deps, slice_current_id]);
  slice_deps = new Set();
  slice_current_id = id;
}

function slice_deps_close() {
  box_deps.set(slice_current_id, slice_deps);
  [slice_deps, slice_current_id] = slice_deps_stack.pop();
}

export function box(value) {
  const id = box_seq_next();
  return {
    get() {
      slice_deps.add(id);
      return value;
    },
    set(val) {
      if (Object.is(value, val)) return;
      value = val;
      const no_tick = tick_deep === 0;
      if (no_tick) tick_start();
      tick_changed.add(id);
      if (no_tick) tick_finish();
    }
  };
}

export function computed(fn) {
  const id = box_seq_next();
  box_invalid.add(id);
  let cache = 0;
  return function() {
    slice_deps.add(id);
    if (!box_invalid.has(id)) return cache;
    slice_deps_open(id);
    cache = fn.apply(this, arguments);
    box_invalid.delete(id);
    slice_deps_close();
    return cache;
  };
}

export function expr(fn) {
  const id = box_seq_next();
  const expr_id = expr_seq_next();
  return function() {
    const block = () => {
      slice_deps_open(id);
      expr_start(expr_id);
      fn.apply(this);
      expr_finish();
      box_invalid.delete(id);
      slice_deps_close();
    };
    box_expr.set(id, block);
    block();
  };
}

export function entry(fn) {
  return function() {
    tick_start();
    const res = fn.apply(this, arguments);
    tick_finish();
    return res;
  };
}

export function receiver(fn) {
  const id = box_seq_next();
  receiver_notify.set(id, fn);
  return id;
}

export function receiver_reset(id) {
  receiver_deps.delete(id);
  box_deps.delete(id);
}

export function receiver_free(id) {
  receiver_reset(id);
  receiver_notify.delete(id);
}

export function receiver_open(id) {
  slice_deps_stack.push([slice_deps, slice_current_id]);
  slice_current_id = id;
  slice_deps = receiver_deps.get(id) || new Set();
}

export function receiver_close(id) {
  let deps = receiver_deps.get(id);
  if (!deps) {
    deps = new Set();
    receiver_deps.set(id, deps);
  }
  for (const x of slice_deps) {
    deps.add(x);
  }
  [slice_deps, slice_current_id] = slice_deps_stack.pop();
}

// Debug
export const get_slice_current_id = () => slice_current_id;
export const get_slice_deps = () => [...slice_deps];
export const get_box_seq_current = () => box_seq_current;
export const print_graph = () => {
  const line = [];
  for (const [x, deps] of box_deps) {
    line.push(x, [...deps]);
  }
  for (const [x, deps] of receiver_deps) {
    line.push(x, [...deps]);
  }
  line.push("!", [...box_invalid]);
  console.log(">", ...line, "<");
};
// End debug
