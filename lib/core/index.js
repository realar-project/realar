import core_factory from "./assembly/index.ts";

const
  box_value_create = 0,       /* a0 */
  box_value_get_phase = 1,    /* a1 */
  box_value_set_phase = 2,    /* a2 */
  box_expr_create = 3,        /* a3 */
  box_expr_start = 4,         /* a4 */
  box_expr_finish = 5,        /* a5 */
  // box_computed_create = 6,    /* a6 */
  // box_computed_start = 7,     /* a7 */
  // box_computed_finish = 8,    /* a8 */
  box_entry_start = 9,        /* a9 */
  box_entry_finish = 10,      /* aa */
  box_collection_start = 11,  /* ab */
  box_collection_finish = 12, /* ac */
  box_collection_free = 13,   /* ad */
  box_free = 14               /* ae */
;

const
  box_index_radix = 16,
  box_index_from = parseInt("a0", box_index_radix),
  box_index_to = parseInt("ae", box_index_radix)
;

let
  core = make(),
  fns = new Map(),
  fns_stack = []
;

export {
  core,
  fns,
  push,
  pop,
  ready,

  box_value_create,
  box_value_get_phase,
  box_value_set_phase,
  box_expr_start,
  box_expr_finish,
  box_expr_create,
  box_entry_start,
  box_entry_finish,
  box_collection_start,
  box_collection_finish,
  box_collection_free,
  box_free
};

function push() {
  core.u(); /* push */
  fns_stack.push(new Map(fns));
  fns.clear();
}

function pop() {
  core.o(); /* pop */
  fns.clear();
  fns_stack.pop().forEach((v, k) => fns.set(k, v));
}

function ready(fn, ...args) {
  return fn
    ? core.w.then(() => {
        fn(...args);
      })
    : core.w;
}

function make() {
  let core = [];
  fill_core(core);
  core.w = core_factory({ call, error }).then(asm_exports => {
    asm_exports.s(); /* start */
    fill_core(core, asm_exports);
  });
  return core;
}

function fill_core(core, asm_exports) {
  if (asm_exports) {
    for (let i = box_index_from; i <= box_index_to; i++) {
      core[i - box_index_from] = asm_exports[
        i.toString(box_index_radix)
      ];
    }
    core.o = asm_exports.o;
    core.u = asm_exports.u;
  } else {
    for (let i = box_index_from; i <= box_index_to; i++) {
      core[i - box_index_from] = not_ready_error;
    }
    core.o = core.u = not_ready_error;
  }
}

function not_ready_error() {
  throw new Error("Realar core not ready yet! Please use `ready` function.");
}

function error(code) {
  let msg = "Unknown error";
  switch(code) {
    case 1: // TICK_DEEP_LIMIT_EXCEPTION
      msg = "Tick deep limit exception";
      break;
    case 2: // DIGEST_LOOP_LIMIT_EXCEPTION
      msg = "Limit digest loop iteration";
      break;
  }
  throw new Error(msg);
}

function call(key) {
  fns.get(key)();
}
