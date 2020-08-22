import core_factory from "./assembly/index.ts";

const
  box_value_create = 0,     /* b0 */
  box_value_get_phase = 1,  /* b1 */
  box_value_set_phase = 2,  /* b2 */
  box_expr_create = 3,      /* b3 */
  box_expr_start = 4,       /* b4 */
  box_expr_finish = 5,      /* b5 */
  box_computed_create = 6,  /* b6 */
  box_computed_start = 7,   /* b7 */
  box_computed_finish = 8,  /* b8 */
  box_entry_start = 9,      /* b9 */
  box_entry_finish = 10,    /* ba */
  box_view_create = 11,     /* bb */
  box_view_start = 12,      /* bc */
  box_view_finish = 13,     /* bd */
  box_free = 14             /* be */
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
  box_entry_start,
  box_entry_finish
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
  let box_fn_keys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e"];
  for (const k of box_fn_keys) {
    target.push(core["b" + k]);
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
