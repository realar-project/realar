import { call } from "./call";
import { error, TICK_DEEP_LIMIT_EXCEPTION, DIGEST_LOOP_LIMIT_EXCEPTION } from "./error";
import { seq_next } from "./seq";

const TICK_DEEP_LIMIT = 100;
const DIGEST_LOOP_LIMIT = 100;

type slice_deps_type = Set<i32> | null;

@unmanaged class slice_deps_stack_item_type {
  slice_deps: slice_deps_type;
  slice_current_id: i32;
}

@unmanaged class box_slice_stack_item_type {
  tick_deep: i32;
  tick_changed: Set<i32>;
  slice_deps_stack: slice_deps_stack_item_type[];
  slice_deps: slice_deps_type;
  slice_current_id: i32;
  box_deps: Map<i32, Set<i32>>;
  box_rels: Map<i32, Set<i32>>;
  box_invalid: Set<i32>;
  box_expr: Set<i32>;
  box_entry_id: i32;
}

let
  box_slice_stack: box_slice_stack_item_type[],
  tick_deep: i32,
  tick_changed: Set<i32>,
  slice_deps_stack: slice_deps_stack_item_type[],
  slice_deps: slice_deps_type,
  slice_current_id: i32,
  box_deps: Map<i32, Set<i32>>,
  box_rels: Map<i32, Set<i32>>,
  box_invalid: Set<i32>,
  box_expr: Set<i32>,
  box_entry_id: i32;

export {
  box_init,
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
  box_view_create,
  box_view_start,
  box_view_finish,

  box_slice_push,
  box_slice_pop
}

@inline
function box_init(): void {
  box_slice_stack = [];
  box_slice_init();
}

@inline
function box_slice_init(): void {
  tick_deep = 0;
  tick_changed = new Set<i32>();
  slice_deps_stack = [];
  slice_deps = null;
  slice_current_id = 0;
  box_deps = new Map<i32, Set<i32>>();
  box_rels = new Map<i32, Set<i32>>();
  box_invalid = new Set<i32>();
  box_expr = new Set<i32>();
  box_entry_id = box_create();
}

@inline
function box_slice_push(): void {
  box_slice_stack.push({
    tick_deep,
    tick_changed,
    slice_deps_stack,
    slice_deps,
    slice_current_id,
    box_deps,
    box_rels,
    box_invalid,
    box_expr,
    box_entry_id
  });
  box_slice_init();
}

@inline
function box_slice_pop(): void {
  let struct = box_slice_stack.pop();
  tick_deep = struct.tick_deep;
  tick_changed = struct.tick_changed;
  slice_deps_stack = struct.slice_deps_stack;
  slice_deps = struct.slice_deps;
  slice_current_id = struct.slice_current_id;
  box_deps = struct.box_deps;
  box_rels = struct.box_rels;
  box_invalid = struct.box_invalid;
  box_expr = struct.box_expr;
  box_entry_id = struct.box_entry_id;
}

@inline
function tick_start(): void {
  if (!tick_deep) tick_changed.clear();
  tick_deep ++;

  if (tick_deep > TICK_DEEP_LIMIT) {
    error(TICK_DEEP_LIMIT_EXCEPTION)
  }
}

@inline
function box_deep_invalidate(next_bound: Set<i32>): void {
  let bound: Set<i32>;
  for(;;) {
    bound = next_bound;
    next_bound = new Set<i32>();

    for (let i = 0, vals = bound.values(), len = vals.length; i < len; i++) {
      let x = vals[i];
      if (box_rels.has(x)) {
        let rels = box_rels.get(x);
        for (let i = 0, vals = rels.values(), len = vals.length; i < len; i++) {
          let r = vals[i];
          box_invalid.add(r);
          next_bound.add(r);
        }
      }
    }
    if (!next_bound.size) break;
  }
}

function tick_finish(): void {
  if (tick_deep > 1 || !tick_changed.size) {
    tick_deep --;
    return;
  }

  let limit = DIGEST_LOOP_LIMIT;
  for (;limit; limit--) {
    box_deep_invalidate(tick_changed);
    tick_changed.clear()

    for (let i = 0, vals = box_invalid.values(), len = vals.length; i < len; i++) {
      let x = vals[i];
      if (box_expr.has(x)) call(x);
    }

    if (!tick_changed.size) break;
  }

  tick_deep --;
  if (!limit) {
    error(DIGEST_LOOP_LIMIT_EXCEPTION)
  }
}

@inline
function box_create(): i32 {
  return seq_next();
}

@inline
function slice_deps_globals_push(): void {
  slice_deps_stack.push({
    slice_deps,
    slice_current_id
  });
}

@inline
function slice_deps_globals_pop(): void {
  let struct = slice_deps_stack.pop();
  slice_deps = struct.slice_deps;
  slice_current_id = struct.slice_current_id;
}

@inline
function slice_deps_open(id: i32): void {
  slice_deps_globals_push();
  slice_deps = new Set<i32>();
  slice_current_id = id
}

function slice_deps_close(): void {
  box_invalid.delete(slice_current_id);

  // if (box_deps.has(slice_current_id)) {
  //   // TODO: remove rels from prev_deps (need to find diff between prev and new)
  // }
  box_deps.set(slice_current_id, slice_deps!);

  for (let i = 0, vals = slice_deps!.values(), len = vals.length; i < len; i++) {
    let d = vals[i];
    let rels: Set<i32>;

    if (box_rels.has(d)) {
      rels = box_rels.get(d);
    } else {
      rels = new Set<i32>();
      box_rels.set(d, rels);
    }

    rels.add(slice_current_id)
  }

  slice_deps_globals_pop();
}

function box_value_create(): i32 {
  return box_create();
}

function box_value_get_phase(id: i32): void {
  if (slice_deps) {
    slice_deps!.add(id);
  }
}

function box_value_set_phase(id: i32): void {
  let no_tick = !tick_deep
  if (no_tick) tick_start();

  tick_changed.add(id);
  if (no_tick) tick_finish();
}

function box_expr_create(): i32 {
  let id = box_create();
  box_expr.add(id);
  return id
}

function box_expr_start(id: i32): void {
  slice_deps_open(id);
  tick_start();
}

function box_expr_finish(): void {
  tick_finish();
  slice_deps_close();
}

function box_computed_create(): i32 {
  let id = box_create();
  box_invalid.add(id);
  return id
}

function box_computed_start(id: i32): boolean {
  if (slice_deps) {
    slice_deps!.add(id);
  }
  if (box_invalid.has(id)) {
    slice_deps_open(id);
    return false;
  }
  return true;
}

function box_computed_finish(): void {
  slice_deps_close();
}

function box_entry_start(): void {
  slice_deps_globals_push();
  slice_deps = null; // No need to collect deps in entry phase
  slice_current_id = box_entry_id;
  tick_start();
}

function box_entry_finish(): void {
  tick_finish();
  slice_deps_globals_pop();
}

function box_view_create(): i32 {
  return 0;
}
function box_view_start(id: i32): void {}
function box_view_finish(): void {}
