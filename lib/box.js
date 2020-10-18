const
  tick_deep_limit = 10000,
  validate_loop_limit = 10000,
  box_entry_id = 1;

let
  box_seq_current = box_entry_id,
  box_collection_seq_current = 0,
  tick_deep = 0,
  tick_changed = new Set(),
  slice_deps_stack = [],
  slice_deps = null,
  slice_current_id = 0,
  box_deps = new Map(),
  box_rels = new Map(),
  box_invalid = new Set(),
  box_expr = new Map(),
  box_collection_stack = [],
  box_collection_ids = null,
  box_collection_map = new Map();

export {
  box_value_create,
  box_value_get_phase,
  box_value_set_phase,
  box_expr_create,
  box_expr_start,
  box_expr_finish,
  box_computed_create,
  box_computed_start,
  box_computed_finish,
  box_entry_start,
  box_entry_finish,
  box_collection_start,
  box_collection_finish,
  box_collection_free,
  box_free
}

function box_seq_next() {
  return ++box_seq_current;
}

function box_collection_seq_next() {
  return ++box_collection_seq_current;
}

function tick_start() {
  if (!tick_deep) tick_changed.clear();
  tick_deep ++;

  if (tick_deep > tick_deep_limit) {
    throw new Error("Tick deep limit exception");
  }
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
  }
  while (next_bound.size);
}

function tick_finish() {
  if (tick_deep > 1 || !tick_changed.size) {
    tick_deep --;
    return;
  }

  let limit = validate_loop_limit;
  while (--limit) {
    box_deep_invalidate(tick_changed);
    tick_changed.clear()

    for (const x of box_invalid) {
      const expr = box_expr.get(x);
      if (expr) expr();
    }

    if (!tick_changed.size) break;
  }

  tick_deep --;
  if (!limit) {
    throw new Error("Limit of expressions iteration");
  }
}

function box_create() {
  const box_id = box_seq_next();
  if (box_collection_ids) box_collection_ids.push(box_id);
  return box_id;
}

function box_free(id) {
  const deps = box_deps.get(id);
  if (deps) {
    for (const d of deps) {
      const rels = box_rels.get(d);
      if (rels) rels.delete(id);
    }
  }

  const rels = box_rels.get(id);
  if (rels) {
    for (const r of rels) {
      const deps = box_deps.get(r);
      if (deps) deps.delete(id);
    }
  }

  box_deps.delete(id);
  box_rels.delete(id);

  box_invalid.delete(id);
  box_expr.delete(id);
}

function box_collection_start() {
  box_collection_stack.push(box_collection_ids);
  box_collection_ids = [];
}

function box_collection_finish() {
  const collection_id = box_collection_seq_next();
  box_collection_map.set(collection_id, box_collection_ids);
  box_collection_ids = box_collection_stack.pop();
  return collection_id;
}

function box_collection_free(id) {
  const ids = box_collection_map.get(id);
  for (const id of ids) box_free(id);
  box_collection_map.delete(id);
}

function slice_deps_globals_push() {
  slice_deps_stack.push([
    slice_deps,
    slice_current_id
  ]);
}

function slice_deps_globals_pop() {
  [slice_deps, slice_current_id] = slice_deps_stack.pop();
}

function slice_deps_open(id) {
  slice_deps_globals_push();
  slice_deps = new Set();
  slice_current_id = id
}

function slice_deps_close() {
  box_invalid.delete(slice_current_id);

  // if (box_deps.has(slice_current_id)) {
  //   // TODO: remove rels from prev_deps (need to find diff between prev and new)
  // }
  box_deps.set(slice_current_id, slice_deps);

  for (const d of slice_deps) {
    let rels = box_rels.get(d);
    if (!rels) {
      box_rels.set(d, (rels = new Set()));
    }
    rels.add(slice_current_id)
  }

  slice_deps_globals_pop();
}

function box_value_create() {
  return box_create();
}

function box_value_get_phase(id) {
  if (slice_deps) {
    slice_deps.add(id);
  }
}

function box_value_set_phase(id) {
  const no_tick = !tick_deep
  if (no_tick) tick_start();
  tick_changed.add(id);
  if (no_tick) tick_finish();
}

function box_expr_create(expr_fn) {
  const id = box_create();
  box_expr.set(id, expr_fn);
  return id
}

function box_expr_start(id) {
  slice_deps_open(id);
  tick_start();
}

function box_expr_finish() {
  tick_finish();
  slice_deps_close();
}

function box_computed_create() {
  const id = box_create();
  box_invalid.add(id);
  return id
}

function box_computed_start(id) {
  if (slice_deps) {
    slice_deps.add(id);
  }
  if (box_invalid.has(id)) {
    slice_deps_open(id);
    return false;
  }
  return true;
}

function box_computed_finish() {
  slice_deps_close();
}

function box_entry_start() {
  slice_deps_globals_push();
  slice_deps = null; // No need to collect deps in entry phase
  slice_current_id = box_entry_id;
  tick_start();
}

function box_entry_finish() {
  tick_finish();
  slice_deps_globals_pop();
}
