import { expr_start, expr_finish } from "./expr";
import { link, unlink, unlink_fn } from "./link";
import { view_start, view_finish } from "./view";
import { unit_inst_key } from "./unit";

let
  box_seq_current = 0,
  box_deps = new Map(),
  box_rels = new Map(),
  box_invalid = new Set(),
  box_expr = new Map(),
  box_notify = new Map(),
  slice_deps = null,
  slice_current_id = 0,
  slice_deps_stack = [],
  tick_changed = null,
  tick_deep = 0,
  entry_id = 0;

export {
  box,
  computed,
  expr,
  view_create,
  view_block,
  entry_start,
  entry_finish
}

function tick_start() {
  if (!tick_deep) tick_changed = new Set();
  ++tick_deep;

  // console.log("TICK", tick_deep);
  if (tick_deep > 100) throw new Error("Tick deep limit exception");
  // next_tick_print_graph();
}

function box_deep_invalidate(next_bound) {
  let bound;
  do {
    bound = next_bound;
    next_bound = new Set();

    for (const x of bound) {
      const rels = box_rels.get(x);
      if (rels) {
        for (const r of rels) {
          box_invalid.add(r);
          next_bound.add(r);
        }
      }
    }
  } while (next_bound.size);
}

function tick_finish() {
  // console.log("TICK FINISH", tick_deep);
  if (tick_deep > 1 || !tick_changed.size) {
    --tick_deep;
    return;
  }

  box_deep_invalidate(tick_changed);

  let limit = 100;
  let tick_changed_size;
  let has_limit_overflow = false;
  do {
    if (!limit--) {
      has_limit_overflow = true;
      break;
    }

    const changed = new Set(tick_changed);
    tick_changed = new Set();

    // console.log("DIGEST changed", [...changed]);

    for (const [id, expr] of new Map(box_expr)) {
      const deps = box_deps.get(id);
      if (!deps) continue;
      for (const d of deps) {
        if (changed.has(d) || box_invalid.has(d)) {
          expr();
          break;
        }
      }
    }

    for (const [id, notify] of new Map(box_notify)) {
      const deps = box_deps.get(id);
      if (!deps) continue;
      for (const d of deps) {
        if (changed.has(d) || box_invalid.has(d)) {
          notify();
          break;
        }
      }
    }

    // console.log("DIGEST tick_changed", [...tick_changed]);

    tick_changed_size = tick_changed.size;
    if (tick_changed_size) box_deep_invalidate(tick_changed);
  } while (tick_changed_size);

  --tick_deep;

  if (has_limit_overflow) {
    throw new Error("Limit digest loop iteration");
  }
}

function box_create() {
  const id = ++box_seq_current;
  unlink_fn(box_free.bind(null, id));
  // TODO:
  // I can collect all created boxes
  // by slice, and return it through core method
  return id;
}

function slice_deps_open(id) {
  slice_deps_stack.push([slice_deps, slice_current_id]);
  slice_deps = new Set();
  slice_current_id = id;
}

function slice_deps_close() {
  box_invalid.delete(slice_current_id);
  box_deps.set(slice_current_id, slice_deps);

  for (const d of slice_deps) {
    let rels = box_rels.get(d);
    if (!rels) {
      box_rels.set(d, (rels = new Set()));
    }
    rels.add(slice_current_id);
  }
  [slice_deps, slice_current_id] = slice_deps_stack.pop();
}

function box_free(id) {
  // console.log("BOX FREE", id);
  let deps = box_deps.get(id);
  if (deps) {
    for (const d of deps) {
      const rels = box_rels.get(d);
      if (rels) {
        rels.delete(id);
      }
    }
  }
  // set_free(deps);
  box_deps.delete(id);

  let rels = box_rels.get(id);
  if (rels) {
    for (const r of rels) {
      const deps = box_deps.get(r);
      if (deps) {
        deps.delete(id);
      }
    }
  }
  // set_free(rels);
  box_rels.delete(id);

  box_invalid.delete(id);
  box_expr.delete(id);
  box_notify.delete(id);
}

function box(value) {
  const id = box_create();
  return {
    get() {
      if (slice_deps) slice_deps.add(id);
      return value;
    },
    set(val) {
      if (Object.is(value, val)) return;
      if (value && value[unit_inst_key]) unlink(value);
      value = val;
      if (value && value[unit_inst_key]) link(value);
      const no_tick = !tick_deep;
      if (no_tick) tick_start();
      tick_changed.add(id);
      if (no_tick) tick_finish();
    }
  };
}

function computed(fn) {
  const id = box_create();
  box_invalid.add(id);
  let cache = 0;
  return function() {
    if (slice_deps) slice_deps.add(id);
    if (!box_invalid.has(id)) return cache;
    slice_deps_open(id);
    cache = fn.apply(this, arguments);
    slice_deps_close();
    return cache;
  };
}

function expr(fn) {
  const id = box_create();
  return function() {
    const block = () => {
      slice_deps_open(id);
      expr_start(id);
      const no_tick = !tick_deep;
      if (no_tick) tick_start();
      fn.apply(this);
      if (no_tick) tick_finish();
      expr_finish();
      slice_deps_close();
    };
    box_expr.set(id, block);
    block();
  };
}

function view_create(sync) {
  const id = box_create();
  box_notify.set(id, sync);
  return id;
}

function view_block(id, fn) {
  return function() {
    slice_deps_open(id);
    view_start(id);
    const res = fn.apply(this, arguments);
    view_finish();
    slice_deps_close();
    return res;
  }
}

function entry_start() {
  if (!entry_id) entry_id = box_create();
  slice_deps_open(entry_id);
  tick_start();
}

function entry_finish() {
  tick_finish();
  [slice_deps, slice_current_id] = slice_deps_stack.pop();
}

// Debug
let
  next_tick_print_graph_tid = 0;

function print_graph(next_tick) {
  const line = [];
  for (const [x, deps] of box_deps) {
    line.push(x, box_deps.size, [...deps]);
  }
  line.push("<>");
  for (const [x, rels] of box_rels) {
    line.push(x, box_rels.size, [...rels]);
  }
  line.push("!", [...box_invalid], box_expr.size, box_notify.size);
  console.log(">", ...line, "<");
  if (!next_tick) next_tick_print_graph();
};

function next_tick_print_graph() {
  if (!next_tick_print_graph_tid) {
    next_tick_print_graph_tid = setTimeout(() => {
      next_tick_print_graph_tid = 0;
      console.log("+++");
      print_graph(1);
    });
  }
}
// End debug
