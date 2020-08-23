import core_factory from "./assembly/index.ts";

const
  box_value_create = 0,       /* a0 */
  box_value_get_phase = 1,    /* a1 */
  box_value_set_phase = 2,    /* a2 */
  box_expr_create = 3,        /* a3 */
  box_expr_start = 4,         /* a4 */
  box_expr_finish = 5,        /* a5 */
  box_computed_create = 6,    /* a6 */
  box_computed_start = 7,     /* a7 */
  box_computed_finish = 8,    /* a8 */
  box_entry_start = 9,        /* a9 */
  box_entry_finish = 10,      /* aa */
  box_collection_start = 14,  /* ab */
  box_collection_finish = 15, /* ac */
  box_collection_free = 16,   /* ad */
  box_free = 17               /* ae */
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
  if (core.w) {
    core.w.then(() => fn(...args));
  } else {
    fn(...args);
  }
}

function make() {
  // const time = Date.now();
  let core = core_factory({ call, error });
  let res = [];
  if (core.then) {
    res.w = core.then(_core => {
      res.w = 0;
      _core.s(); /* start */
      fill_make_res(res, _core);

      // console.log("core:", Date.now() - time);
      return res;
    });
  } else {
    core.s(); /* start */
    fill_make_res(res, core);
  }

  // console.log("core:", Date.now() - time);
  return res;
}

function fill_make_res(target, core) {
  let radix = 16
  let from = parseInt("a0", radix);
  let to = parseInt("ae", radix);

  for (let i = from; i <= to; i++) {
    let k = i.toString(radix);
    target.push(core[k]);
  }

  target.o = core.o;
  target.u = core.u;
}


function error(code) {
  let msg = "Unknown error";
  switch(code) {
    case 1: // TICK_DEEP_LIMIT_EXCEPTION
      msg = "Tick deep limit exception";
      break;
    case 2: // DIGEST_LOOP_LIMIT_EXCEPTION
      mag = "Limit digest loop iteration";
      break;
  }
  throw new Error(msg);
}

function call(key) {
  fns.get(key)();
}
