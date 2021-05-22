import React, { Context, FC } from 'react';
import rb, { transaction, untrack } from 'reactive-box';

export {
  _value,
  _selector,
  _transaction,
  _signal,
  _untrack,
  _on,
  _sync,

  value,
  selector,
  prop,
  cache,
  signal,
  ready,
  on,
  un,
  hook,
  sync,
  cycle,
  loop,
  pool,
  stoppable,
  isolate,
  shared,
  initial,
  observe,
  useValue,
  useLocal,
  useScoped,
  shared as useShared,
  Scope,
  free,
  mock,
  unmock,
  transaction,
  untrack,
  Ensurable,
  Selector,
  Value,
  Signal,
  StopSignal,
  ReadySignal,
};

let react;

let useRef: typeof React.useRef;
let useReducer: typeof React.useReducer;
let useEffect: typeof React.useEffect;
let useMemo: typeof React.useMemo;
let useContext: typeof React.useContext;
let createContext: typeof React.createContext;
let createElement: typeof React.createElement;

/* istanbul ignore next */
try {
  react = require('react');

  useRef = react.useRef;
  useReducer = react.useReducer;
  useEffect = react.useEffect;
  useMemo = react.useMemo;
  useContext = react.useContext;
  createContext = react.createContext;
  createElement = react.createElement;
} catch (e) {
  useRef = useReducer = useEffect = useMemo = useContext = createContext = createElement = (() => {
    throw new Error('Missed "react" dependency');
  }) as any;
}

const key = 'val';
const shareds = new Map();

let initial_data: any;
let context_unsubs: any;
let context_hooks: any;
let shared_unsubs = [] as any;
let is_sync: any;
let is_stop_signal: any;
let is_observe: any;
let scope_context: any;
let stoppable_context: any;

const def_prop = Object.defineProperty;












/*
  TODOs:
  [] test case "should work signal.trigger with configured .pre"
  [] test cases for "isolate" (after effect will be removed)
  [] migrate all old test cases to new api

  [] signal.trigger.from
  [] value.trigger.from
  [] signal.trigger.resolved
  [] value.trigger.resolved
  [] .as.trigger
  [] .as.value.trigger
  [] .as.signal.trigger

  [] to remove loop

  [] rename _value to value
  [] rename _signal to signal
  [] rename _selector to selector
*/





//
//  Global js sdk specific definitions.
//

const obj_equals = Object.is;
const obj_def_prop = Object.defineProperty;
const obj_create = Object.create;
const obj_keys = Object.keys;
const obj_is_array = Array.isArray;
const new_symbol = Symbol;
const const_undef = void 0;

//
//  Reactive box specific definitions.
//

const expr = rb.expr;
const box = rb.box;
const sel = rb.sel;
const flow = rb.flow;

const internal_flow_stop = flow.stop;
const internal_untrack = rb.untrack;
const internal_transaction = rb.transaction;

const un_expr = (a,b) => ((a = expr(a,b)), un(a[1]), a);
const un_flow = (a,b,c) => ((a = flow(a,b,c)), un(a[2]), a);


//
//  Entity builder for value, signal and etc. Typings.
//

type ValueFactory = {
  (initial?: any): any;
  trigger: {
    (initial?: any): any;
    flag: {
      (initial?: any): any;
      invert: { (initial?: any): any }
    }
  };
  from: { (get: () => any, set?: (v) => any): any },
  combine: { (cfg: any): any }
}
type SelectorFactory = {
  (fn: () => any): any;
}
type SignalFactory<T> = ValueFactory;


//
//  Entity builder implementation.
//

const pure_fn = function () {};
const pure_arrow_fn_returns_arg = (v) => v;
const pure_arrow_fn_returns_not_arg = (v) => !v;
const pure_arrow_fn_returns_undef = (() => {}) as any;

const key_proto = "__proto__";
const key_get = "get";
const key_set = "set";
const key_promise = "promise";
const key_promise_internal = new_symbol();
const key_reset = "reset";
const key_initial = new_symbol();
const key_dirty_handler = new_symbol();
const key_dirty = "dirty";
const key_sync = "sync";
const key_ctx = new_symbol();
const key_by = "by";
const key_reinit = "reinit";
const key_update = "update";
const key_val = "val";
const key_once = "once";
const key_to = "to";
const key_select = "select";
const key_view = "view";
const key_handler = new_symbol();
const key_pre = "pre";
const key_filter = "filter";
const key_not = "not";
const key_flow = "flow";
const key_reset_promise_by_reset = new_symbol();
const key_touched_internal = new_symbol();
const key_trigger = "trigger";
const key_flag = "flag";
const key_invert = "invert";
const key_from = "from";
const key_is_signal = new_symbol();
const key_track = "track";
const key_untrack = "untrack";
const key_multiple = "multiple";
const key_combine = "combine";
const key_join = "join";
const key_value = "value";
const key_as = "as";
const key_op = "op";

const obj_def_prop_value = (obj, key, value) => (
  obj_def_prop(obj, key, { value }), value
);

const obj_def_prop_trait = (obj, key, trait) =>
  obj_def_prop(obj, key, {
    get() {
      return obj_def_prop_value(this, key, trait.bind(const_undef, this));
    }
  });

const obj_def_prop_with_ns = (obj, key, ns) =>
  obj_def_prop(obj, key, {
    get() {
      const ret = {};
      ret[key_proto] = ns;
      ret[key_ctx] = this;
      return obj_def_prop_value(this, key, ret);
    }
  });

const obj_def_prop_trait_ns = (obj, key, trait) =>
  obj_def_prop(obj, key, {
    get() {
      return obj_def_prop_value(this, key, trait.bind(const_undef, this[key_ctx]));
    }
  });

const obj_def_prop_trait_ns_with_ns = (obj, key, trait, ns, is_trait_op?) =>
  obj_def_prop(obj, key, {
    get() {
      const ctx = this[key_ctx];
      const ret = (is_trait_op ? trait(ctx) : trait).bind(const_undef, ctx);
      ret[key_proto] = ns;
      ret[key_ctx] = ctx;
      return obj_def_prop_value(this, key, ret);
    }
  });

const obj_def_prop_trait_with_ns = (obj, key, trait, ns, is_trait_op?) =>
  obj_def_prop(obj, key, {
    get() {
      const ret = (is_trait_op ? trait(this) : trait).bind(const_undef, this);
      ret[key_proto] = ns;
      ret[key_ctx] = this;
      return obj_def_prop_value(this, key, ret);
    }
  });

const obj_def_prop_factory = (obj, key, factory) =>
  obj_def_prop(obj, key, {
    get() {
      return obj_def_prop_value(this, key, factory(this));
    }
  });

const obj_def_prop_promise = (obj) => {
  return obj_def_prop(obj, key_promise, {
    get() {
      const ctx = this;
      if (!ctx[key_promise_internal]) {
        ctx[key_promise_internal] = new Promise((resolve) =>
          // TODO: should be the highest priority.
          expr(ctx[key_get], () => {
            if (!ctx[key_handler][key_reset_promise_by_reset]) ctx[key_promise_internal] = 0;
            resolve(ctx[key_get]());
          })[0]()
        );
      }
      return ctx[key_promise_internal];
    }
  });
};



const fill_entity = (handler, proto, has_initial?, initial?, _get?, _set?) => {
  let set = _set || handler[1];
  let get = _get || handler[0];
  has_initial && (handler[key_initial] = initial);

  let ctx;
  if (set) {
    ctx = set;
    ctx[key_set] = set;
    obj_def_prop(ctx, key_val, { get, set });
  } else {
    ctx = {};
    obj_def_prop(ctx, key_val, { get })
  }
  ctx[key_handler] = handler;
  ctx[key_proto] = proto;
  ctx[key_get] = get;
  return ctx;
}

const reactionable_subscribe = (target, fn, is_once?, is_sync?) => {
  target = target[key_get] || sel(target)[0];
  let value: any;
  const e = un_expr(target, () => {
    const prev = value;
    fn(is_once ? target() : (value = e[0]()), prev);
  });
  value = e[0]();
  if (is_sync) _untrack(fn.bind(const_undef, value, const_undef));
}

const make_join_entity = (fn_get, join_cfg, is_signal?, set?, is_untrack?) => {
  const fns = join_cfg.map(is_signal
    ? (fn) => fn[key_get] || fn
    : (fn) => sel(fn[key_get] || fn)[0]
  );
  const h = [
    () => {
      const ret = [fn_get()];
      const finish = is_untrack && internal_untrack();
      try { return ret.concat(fns.map(f => f())) }
      finally { finish && finish() }
    },
    set && set.bind()
  ];
  h[key_is_signal] = is_signal;
  return fill_entity(h, set ? proto_entity_writtable : proto_entity_readable)
}

const make_trait_ent_pure_fn_untrack = (trait_fn) =>
  (ctx, fn) => trait_fn(ctx, fn && ((a,b) => {
    const finish = internal_untrack();
    try { return fn(a,b); }
    finally { finish() }
  }));

const make_trait_ent_untrack = (trait_fn) =>
  (ctx, fn) => trait_fn(ctx, fn && ((a,b) => {
    const finish = internal_untrack();
    try { return (fn[key_get] ? fn[key_get]() : fn(a,b)) }
    finally { finish() }
  }));

const op_trait_if_signal = (trait_if_not_signal, trait_if_signal) => (
  (ctx) => ctx[key_handler][key_is_signal] ? trait_if_signal : trait_if_not_signal
);

const make_proto_for_trackable_ns = (trait_track, trait_untrack) => (
  obj_def_prop_trait_ns(
    obj_def_prop_trait_ns(obj_create(pure_fn), key_track, trait_track),
    key_untrack, trait_untrack)
);

const prop_factory_dirty_required_initial = (ctx) => {
  const h = ctx[key_handler];
  if (!h[key_dirty_handler]) {
    const b = box(h[key_initial]);
    obj_def_prop(h, key_initial, { get: b[0], set: b[1] });

    h[key_dirty_handler] = sel(
      () => !obj_equals(h[0](), h[key_initial])
    ).slice(0, 1);
  }
  return fill_entity(h[key_dirty_handler], proto_entity_readable);
};



const trait_ent_update = (ctx, fn) => (fn && ctx[key_set](fn(_untrack(ctx[key_get]))));
const trait_ent_update_untrack = make_trait_ent_pure_fn_untrack(trait_ent_update);
const trait_ent_update_by = (ctx, src, fn) => {
  const src_get = src[key_get] || src;
  const e = un_expr(src_get, fn
    ? () => {
      try {
        ctx[key_set](fn(ctx[key_get](), src_get(), prev_value));
      } finally { prev_value = e[0](); }
    }
    : () => (ctx[key_set](src_get()), (prev_value = e[0]()))
  );
  let prev_value = e[0]();
  return ctx;
};
const trait_ent_sync = (ctx, fn) => (reactionable_subscribe(ctx, fn, 0, 1), ctx);
const trait_ent_reset = (ctx) => {
  ctx[key_promise_internal] = 0;
  ctx[key_handler][1](ctx[key_handler][key_initial]);
  ctx[key_handler][key_touched_internal] = 0;
};
const trait_ent_reset_by = (ctx, src) => {
  const src_get = src[key_get] || src;
  const e = un_expr(src_get, () => {
    trait_ent_reset(ctx);
    e[0]()
  });
  e[0]();
  return ctx;
};
const trait_ent_reinit = (ctx, initial) => {
  ctx[key_handler][key_initial] = initial;
  trait_ent_reset(ctx);
};
const trait_ent_reinit_by = (ctx, src) => {
  const src_get = src[key_get] || src;
  const e = un_expr(src_get, () => {
    trait_ent_reinit(ctx, src_get());
    e[0]();
  });
  e[0]();
  return ctx;
};
const trait_ent_to = (ctx, fn) => (reactionable_subscribe(ctx, fn), ctx);
const trait_ent_to_once = (ctx, fn) => (reactionable_subscribe(ctx, fn, 1), ctx);
const trait_ent_select = (ctx, fn) => (
  fill_entity(sel(fn ? () => fn(ctx[key_get]()) : ctx[key_get]).slice(0, 1), proto_entity_readable)
);
const trait_ent_select_untrack = make_trait_ent_pure_fn_untrack(trait_ent_select);
const trait_ent_select_multiple = (ctx, cfg) => obj_keys(cfg).reduce((ret, key) => (
  (ret[key] = trait_ent_select(ctx, cfg[key])), ret
), obj_is_array(cfg) ? [] : {});
const trait_ent_select_multiple_untrack = (ctx, cfg) => obj_keys(cfg).reduce((ret, key) => (
  (ret[key] = trait_ent_select_untrack(ctx, cfg[key])), ret
), obj_is_array(cfg) ? [] : {});
const trait_ent_view = (ctx, fn) => (
  fill_entity(ctx[key_handler], ctx[key_proto],
    0, 0,
    fn ? () => fn(ctx[key_get]()) : ctx[key_get],
    ctx[key_set] && ctx[key_set].bind()
  )
);
const trait_ent_view_untrack = make_trait_ent_pure_fn_untrack(trait_ent_view);
const trait_ent_pre = (ctx, fn) => (
  fn
    ? fill_entity(ctx[key_handler], ctx[key_proto],
      0, 0,
      ctx[key_get],
      (v) => ctx[key_set](fn(v))
    )
    : ctx
);
const trait_ent_pre_untrack = make_trait_ent_pure_fn_untrack(trait_ent_pre);
const trait_ent_pre_filter = (ctx, fn) => (
  (fn = fn
    ? (fn[key_get] || fn)
    : pure_arrow_fn_returns_arg
  ), fill_entity(ctx[key_handler], ctx[key_proto],
    0, 0,
    ctx[key_get],
    (v) => fn(v) && ctx[key_set](v)
  )
);
const trait_ent_pre_filter_untrack = make_trait_ent_untrack(trait_ent_pre_filter);
const trait_ent_pre_filter_not = (ctx, fn) => (
  trait_ent_pre_filter(ctx, fn
    ? (fn[key_get]
      ? () => !fn[key_get]()
      : (v) => !fn(v))
    : pure_arrow_fn_returns_not_arg)
);
const trait_ent_pre_filter_not_untrack = make_trait_ent_untrack(trait_ent_pre_filter_not);

const trait_ent_flow = (ctx, fn) => {
  fn || (fn = pure_arrow_fn_returns_arg);
  let started, prev;
  const is_signal = ctx[key_handler][key_is_signal];
  const f = un_flow(() => {
    const v = ctx[key_get]();
    try { return fn(v, prev) }
    finally { prev = v }
  }, const_undef, is_signal && pure_arrow_fn_returns_undef);
  const h = [
    () => ((started || (f[0](), (started = 1))), f[1]()),
    ctx[key_set] && ctx[key_set].bind()
  ];
  h[key_is_signal] = is_signal;
  return fill_entity(h,
    h[1] ? proto_entity_writtable : proto_entity_readable
  );
};
const trait_ent_flow_untrack = make_trait_ent_pure_fn_untrack(trait_ent_flow);
const trait_ent_filter = (ctx, fn) => (
  trait_ent_flow(ctx, fn
    ? (fn[key_get] && (fn = fn[key_get]),
      (v, prev) => (
        fn(v, prev) ? v : internal_flow_stop
      ))
    : (v) => v || internal_flow_stop
  )
);
const trait_ent_filter_untrack = make_trait_ent_untrack(trait_ent_filter)
const trait_ent_filter_not = (ctx, fn) => (
  trait_ent_filter(ctx, fn
    ? (fn[key_get] && (fn = fn[key_get]), (v) => !fn(v))
    : pure_arrow_fn_returns_not_arg)
);
const trait_ent_filter_not_untrack = make_trait_ent_untrack(trait_ent_filter_not)

const trait_ent_join = (ctx, cfg) => (
  make_join_entity(ctx[key_get], cfg, ctx[key_handler][key_is_signal], ctx[key_set])
);
const trait_ent_join_untrack = (ctx, cfg) => (
  make_join_entity(ctx[key_get], cfg, ctx[key_handler][key_is_signal], ctx[key_set], 1)
);

const trait_ent_as_value = (ctx) => (
  value_from(ctx[key_get], ctx[key_set])
);
const trait_ent_op = (ctx, f) => (
  (f = f(ctx)), (f === const_undef ? ctx : f)
);




// readable.to:ns
//   .to.once
const proto_entity_readable_to_ns = obj_create(pure_fn);
obj_def_prop_trait_ns(proto_entity_readable_to_ns, key_once, trait_ent_to_once);

// readable.filter:ns           (track|untrack)
//   .filter.not                (track|untrack)
const proto_entity_readable_filter_ns = obj_create(
  make_proto_for_trackable_ns(trait_ent_filter, trait_ent_filter_untrack)
);
obj_def_prop_trait_ns_with_ns(proto_entity_readable_filter_ns, key_not,
  op_trait_if_signal(trait_ent_filter_not, trait_ent_filter_not_untrack),
  make_proto_for_trackable_ns(trait_ent_filter_not, trait_ent_filter_not_untrack),
  1
);

// readable.select:ns           (track|untrack)
//   .select.multiple           (track|untrack)
const proto_entity_readable_select_ns = obj_create(
  make_proto_for_trackable_ns(trait_ent_select, trait_ent_select_untrack)
);
obj_def_prop_trait_ns_with_ns(proto_entity_readable_select_ns, key_multiple, trait_ent_select_multiple,
  make_proto_for_trackable_ns(trait_ent_select_multiple, trait_ent_select_multiple_untrack)
);

// readable.as:ns
//   .as.value
const proto_entity_readable_as_ns = obj_create(pure_fn);
obj_def_prop_trait_ns(proto_entity_readable_as_ns, key_value, trait_ent_as_value);

// readable
//   .sync
//   .op
//   .to:readable.to:ns
//     .to.once
//   .filter:readable.filter:ns (track|untrack)
//     .filter.not              (track|untrack)
//   .select:readable.select:ns (track|untrack)
//     .select.multiple         (track|untrack)
//   .flow                      (track|untrack)
//   .view                      (track|untrack)
//   .join                      (track|untrack)
//   .as:readable.as:ns
//     .as.value
//   .promise
const proto_entity_readable = obj_create(pure_fn);
obj_def_prop_trait(proto_entity_readable, key_sync, trait_ent_sync);
obj_def_prop_trait(proto_entity_readable, key_op, trait_ent_op);
obj_def_prop_trait_with_ns(
  proto_entity_readable,
  key_to,
  trait_ent_to,
  proto_entity_readable_to_ns
);
obj_def_prop_trait_with_ns(
  proto_entity_readable,
  key_filter,
  op_trait_if_signal(trait_ent_filter, trait_ent_filter_untrack),
  proto_entity_readable_filter_ns,
  1
);
obj_def_prop_trait_with_ns(
  proto_entity_readable,
  key_flow,
  op_trait_if_signal(trait_ent_flow, trait_ent_flow_untrack),
  make_proto_for_trackable_ns(trait_ent_flow, trait_ent_flow_untrack),
  1
);
obj_def_prop_trait_with_ns(
  proto_entity_readable,
  key_select,
  trait_ent_select,
  proto_entity_readable_select_ns,
);
obj_def_prop_trait_with_ns(
  proto_entity_readable,
  key_view,
  trait_ent_view,
  make_proto_for_trackable_ns(trait_ent_view, trait_ent_view_untrack),
);
obj_def_prop_trait_with_ns(
  proto_entity_readable,
  key_join,
  trait_ent_join,
  make_proto_for_trackable_ns(trait_ent_join, trait_ent_join_untrack),
);
obj_def_prop_with_ns(
  proto_entity_readable,
  key_as,
  proto_entity_readable_as_ns
);
obj_def_prop_promise(proto_entity_readable);

// writtable.update:ns          (track|untrack)
//   .update.by
const proto_entity_writtable_update_ns = obj_create(
  make_proto_for_trackable_ns(trait_ent_update, trait_ent_update_untrack)
);
obj_def_prop_trait_ns(proto_entity_writtable_update_ns, key_by, trait_ent_update_by);

// writtable.pre.filter:ns      (track|untrack)
//   .pre.filter.not            (track|untrack)
const proto_entity_writtable_pre_filter_ns = obj_create(
  make_proto_for_trackable_ns(trait_ent_pre_filter, trait_ent_pre_filter_untrack)
);
obj_def_prop_trait_ns_with_ns(proto_entity_writtable_pre_filter_ns, key_not, trait_ent_pre_filter_not,
  make_proto_for_trackable_ns(trait_ent_pre_filter_not, trait_ent_pre_filter_not_untrack)
);

// writtable.pre:ns                         (track|untrack)
//   .pre.filter:writtable.pre.filter:ns    (track|untrack)
const proto_entity_writtable_pre_ns = obj_create(
  make_proto_for_trackable_ns(trait_ent_pre, trait_ent_pre_untrack)
);
obj_def_prop_trait_ns_with_ns(
  proto_entity_writtable_pre_ns,
  key_filter,
  trait_ent_pre_filter,
  proto_entity_writtable_pre_filter_ns
);

// writtable <- readable
//   .update:writtable.update:ns            (track|untrack)
//     .update.by
//   .pre:writtable.pre:ns                  (track|untrack)
//     .pre.filter:writtable.pre.filter:ns  (track|untrack)
//       .pre.filter.not                    (track|untrack)
const proto_entity_writtable = obj_create(proto_entity_readable);
obj_def_prop_trait_with_ns(
  proto_entity_writtable,
  key_update,
  trait_ent_update_untrack,
  proto_entity_writtable_update_ns
);
obj_def_prop_trait_with_ns(
  proto_entity_writtable,
  key_pre,
  trait_ent_pre,
  proto_entity_writtable_pre_ns
);

// writtable_leaf.reset:ns
//   .reset.by
const proto_entity_writtable_leaf_reset_ns = obj_create(pure_fn);
obj_def_prop_trait_ns(proto_entity_writtable_leaf_reset_ns, key_by, trait_ent_reset_by);

// writtable_leaf.reinit:ns
//   .reinit.by
const proto_entity_writtable_leaf_reinit_ns = obj_create(pure_fn);
obj_def_prop_trait_ns(proto_entity_writtable_leaf_reinit_ns, key_by, trait_ent_reinit_by);


// writtable_leaf <- writtable
//   .reset:writtable_leaf.reset:ns
//     .reset.by
//   .reinit:writtable_leaf.reinit:ns
//     .reinit.by
//   .dirty
const proto_entity_writtable_leaf = obj_create(proto_entity_writtable);
obj_def_prop_trait_with_ns(
  proto_entity_writtable_leaf,
  key_reset,
  trait_ent_reset,
  proto_entity_writtable_leaf_reset_ns
);
obj_def_prop_trait_with_ns(
  proto_entity_writtable_leaf,
  key_reinit,
  trait_ent_reinit,
  proto_entity_writtable_leaf_reinit_ns
);
obj_def_prop_factory(
  proto_entity_writtable_leaf,
  key_dirty,
  prop_factory_dirty_required_initial
);



const make_trigger = (initial, has_inverted_to?, is_signal?) => {
  const handler = box(initial, () => (handler[key_touched_internal] = 1), is_signal && pure_arrow_fn_returns_undef);
  const set = has_inverted_to
    ? () => { handler[key_touched_internal] || handler[1](!_untrack(handler[0])) }
    : (v) => { handler[key_touched_internal] || handler[1](v) };
  handler[key_reset_promise_by_reset] = 1;
  handler[key_is_signal] = is_signal;
  return fill_entity(handler, proto_entity_writtable_leaf, 1, initial, 0, set);
}

const make_combine = (cfg, is_signal?) => {
  const keys = obj_keys(cfg);
  const fns = keys.map(is_signal
    ? (key) => cfg[key][key_get] || cfg[key]
    : (key) => sel(cfg[key][key_get] || cfg[key])[0]
  );
  const is_array = obj_is_array(cfg);
  const h = [
    () => keys.reduce((ret, key, key_index) => (
      (ret[key] = fns[key_index]()), ret
    ), is_array ? [] : {})
  ];
  h[key_is_signal] = is_signal;
  return fill_entity(h, proto_entity_readable);
}



const _selector: SelectorFactory = (fn) => (
  fill_entity(sel(fn).slice(0, 1), proto_entity_readable)
)


const _value: ValueFactory = ((initial) => (
  fill_entity(box(initial), proto_entity_writtable_leaf, 1, initial)
)) as any;

const value_trigger = (initial) => make_trigger(initial);
const value_trigger_flag = (initial) => make_trigger(!!initial, 1);
const value_trigger_flag_invert = (initial) => make_trigger(!initial, 1);
const value_from = (get, set?) => (
  (get = sel(get[key_get] || get).slice(0, 1),
  set && ((set = set[key_set] || set), (get[1] = set.bind()))),
  fill_entity(get, set ? proto_entity_writtable : proto_entity_readable)
);
const value_combine = (cfg) => make_combine(cfg);

value_trigger_flag[key_invert] = value_trigger_flag_invert;
value_trigger[key_flag] = value_trigger_flag;
_value[key_trigger] = value_trigger as any;
_value[key_from] = value_from;
_value[key_combine] = value_combine;


const _signal: SignalFactory = ((initial) => {
  const h = box(initial, 0 as any, pure_arrow_fn_returns_undef);
  h[key_is_signal] = 1;
  return fill_entity(h, proto_entity_writtable_leaf, 1, initial)
}) as any;

const signal_trigger = (initial) => make_trigger(initial, 0, 1);
const signal_trigger_flag = (initial) => make_trigger(!!initial, 1, 1);
const signal_trigger_flag_invert = (initial) => make_trigger(!initial, 1, 1);
const _signal_from = (get, set?) => (
  (get = [get[key_get] || get],
  (get[key_is_signal] = 1),
  set && ((set = set[key_set] || set), (get[1] = set.bind()))),
  fill_entity(get, set ? proto_entity_writtable : proto_entity_readable)
);
const _signal_combine = (cfg) => make_combine(cfg, 1);

signal_trigger_flag[key_invert] = signal_trigger_flag_invert;
signal_trigger[key_flag] = signal_trigger_flag;
_signal[key_trigger] = signal_trigger as any;
_signal[key_from] = _signal_from;
_signal[key_combine] = _signal_combine;


//
//  Reactive box functions with additional abstraction
//

const _transaction = (fn) => {
  const finish = internal_transaction();
  try { return fn() }
  finally { finish() }
};

const _untrack = (fn) => {
  const finish = internal_untrack();
  try { return fn() }
  finally { finish() }
};



//
// Realar exportable api
//

const un = (unsub: () => void) => {
  unsub && context_unsubs && context_unsubs.push(unsub)
}

const _on_once = (target, fn) => reactionable_subscribe(target, fn, 1);
const _on = (target, fn) => reactionable_subscribe(target, fn);

_on[key_once] = _on_once;

const _sync = (target, fn) => reactionable_subscribe(target, fn, 0, 1);





















































type Ensurable<T> = T | void;

type Callable<T> = {
  name: never;
  (data: T): void;
} & (T extends void
  ? {
      (): void;
    }
  : {});

type Reactionable<T> = { 0: () => T } | [() => T] | (() => T);

type Selector<T> = {
  0: () => T;
  readonly val: T;
  get(): T;
  free(): void;
} & [() => T] & {
    view<P>(get: (data: T) => P): Selector<P>;
    select<P>(get: (data: T) => P): Selector<P>;
    select(): Selector<T>;

    watch: {
      (listener: (value: T, prev: T) => void): () => void;
      once(listener: (value: T, prev: T) => void): () => void;
    };

    flow: {
      filter(fn: (data: T) => any): Value<T, Ensurable<T>>;
    };
  };

type Value<T, K = T> = Callable<T> & {
  0: () => K;
  1: (value: T) => void;
  val: T & K;
  get(): K;

  update: (fn: (state: K) => T) => void;
  sub: {
    <S>(reactionable: Reactionable<S>, fn: (data: K, value: S, prev: S) => T): () => void;
    once<S>(reactionable: Reactionable<S>, fn: (data: K, value: S, prev: S) => T): () => void;
  };
  set(value: T): void;
} & {
  wrap: {
    <P>(set: () => T, get: (data: K) => P): Value<void, P>;
    <P, M = T>(set: (data: M) => T, get: (data: K) => P): Value<M, P>;
    (set: () => T): Value<void, K>;
    <M = T>(set: (data: M) => T): Value<M, K>;

    filter(fn: (data: T) => any): Value<T, K>;
  };

  view<P>(get: (data: K) => P): Value<T, P>;
  select<P>(get: (data: K) => P): Selector<P>;
  select(): Selector<K>;

  watch: {
    (listener: (value: K extends Ensurable<infer P> ? P : K, prev: K) => void): () => void;
    once(listener: (value: K extends Ensurable<infer P> ? P : K, prev: K) => void): () => void;
  };
  reset(): void;

  flow: {
    filter(fn: (data: K) => any): Value<K, Ensurable<T>>;
  };
} & {
    [P in Exclude<keyof Array<void>, number>]: never;
  } &
  [() => K, (value: T) => void];

type Signal<
  T,
  K = T,
  X = {},
  E = {
    reset(): void;
    update: (fn: (state: K) => T) => void;
    sub: {
      <S>(reactionable: Reactionable<S>, fn: (data: K, value: S, prev: S) => T): () => void;
      once<S>(reactionable: Reactionable<S>, fn: (data: K, value: S, prev: S) => T): () => void;
    };
    set(value: T): void;
  }
> = Callable<T> &
  Pick<Promise<T>, 'then' | 'catch' | 'finally'> & {
    0: () => K;
    1: (value: T) => void;
    readonly val: K;
    get(): K;
  } & {
    wrap: {
      <P>(set: () => T, get: (data: K) => P): Signal<void, P, X, E>;
      <P, M = T>(set: (data: M) => T, get: (data: K) => P): Signal<M, P, X, E>;
      (set: () => T): Signal<void, K, X, E>;
      <M = T>(set: (data: M) => T): Signal<M, K, X, E>;

      filter(fn: (data: T) => any): Signal<T, K, X, E>;
    };

    view<P>(get: (data: K) => P): Signal<T, P, X, E>;
    select<P>(get: (data: K) => P): Selector<P>;
    select(): Selector<K>;

    watch: {
      (listener: (value: K extends Ensurable<infer P> ? P : K, prev: K) => void): () => void;
      once(listener: (value: K extends Ensurable<infer P> ? P : K, prev: K) => void): () => void;
    };

    flow: {
      filter(fn: (data: K) => any): Signal<K, Ensurable<T>>;
    };
  } & E &
  X &
  {
    [P in Exclude<keyof Array<void>, number>]: never;
  } &
  [() => K, (value: T) => void];

type StopSignal = Signal<
  void,
  boolean,
  {
    stop(): void;
    set(): void;
    sub: {
      (reactionable: Reactionable<any>): () => void;
      once(reactionable: Reactionable<any>): () => void;
    };
  },
  {}
>;
type ReadySignal<T, K = T> = Signal<
  T,
  K,
  {
    to(value: T): Signal<void, K>;
  }
>;

type Pool<K> = K & {
  count: Selector<number>;
  threads: Selector<StopSignal[]>;
  pending: Selector<boolean>;
};

function value<T = void>(): Value<T>;
function value<T = void>(init: T): Value<T>;
function value(init?: any): any {
  const [get, set] = box(init) as any;
  def_format(set, get, set);
  set.reset = () => set(init);
  return set;
}

function selector<T>(body: () => T): Selector<T> {
  const [get, free] = sel(body);
  const h = [] as any;
  def_format(h, get);
  h.free = free;
  return h;
}

function signal<T = void>(): Signal<T, Ensurable<T>>;
function signal<T = void>(init: T): Signal<T>;
function signal(init?: any) {
  let resolve: any;
  const [get, set] = box([init]);

  const fn = function (data: any) {
    const ready = resolve;
    resolve = def_promisify(fn);
    set([data]);
    ready(data);
  };

  resolve = def_promisify(fn);
  def_format(fn, () => get()[0], fn, 0, 1);
  fn.reset = () => set([init]);
  return fn as any;
}

signal.stop = stop_signal;
signal.ready = ready;
signal.from = signal_from;
signal.combine = signal_combine;

function ready<T = void>(): ReadySignal<T, Ensurable<T>>;
function ready<T = void>(init: T): ReadySignal<T>;
function ready(init?: any) {
  let resolved = 0;
  let resolve: any;
  const [get, set] = box([init]);

  const fn = function (data: any) {
    if (!resolved) {
      resolved = 1;
      set([data]);
      resolve(data);
    }
  };

  resolve = def_promisify(fn);
  def_format(fn, () => get()[0], fn, is_stop_signal, 1, 1);

  if (!is_stop_signal) {
    fn.reset = () => {
      resolve = def_promisify(fn);
      resolved = 0;
      set([init]);
    };
  }

  return fn as any;
}

ready.flag = () => ready(false).to(true);
ready.from = ready_from;
ready.resolved = ready_resolved;

function ready_from<T>(source: Reactionable<T>): ReadySignal<T> {
  const fn = (source as any)[0] || (source as any);
  const dest = ready(fn());
  on(source, dest);
  return dest as any;
}

function ready_resolved(): ReadySignal<void>;
function ready_resolved<T>(value: T): ReadySignal<void, T>;
function ready_resolved(value?: any): any {
  const r = ready(value);
  r(value);
  return r;
}

function signal_from<T>(source: Reactionable<T>): Signal<T> {
  const fn = (source as any)[0] || (source as any);
  const dest = signal(fn());
  on(source, dest);
  return dest as any;
}

function signal_combine(): Signal<[]>;
function signal_combine<A>(a: Reactionable<A>): Signal<[A]>;
function signal_combine<A, B>(a: Reactionable<A>, b: Reactionable<B>): Signal<[A, B]>;
function signal_combine<A, B, C>(
  a: Reactionable<A>,
  b: Reactionable<B>,
  c: Reactionable<C>
): Signal<[A, B, C]>;
function signal_combine<A, B, C, D>(
  a: Reactionable<A>,
  b: Reactionable<B>,
  c: Reactionable<C>,
  d: Reactionable<D>
): Signal<[A, B, C, D]>;
function signal_combine<A, B, C, D, E>(
  a: Reactionable<A>,
  b: Reactionable<B>,
  c: Reactionable<C>,
  d: Reactionable<D>,
  e: Reactionable<E>
): Signal<[A, B, C, D, E]>;
function signal_combine(...sources: any): any {
  const get = () => sources.map((src: any) => (src[0] || src)());
  const dest = signal(get());
  on([get], dest);
  return dest as any;
}

function stop_signal(): StopSignal {
  is_stop_signal = 1;
  try {
    const ctx = ready.flag() as any;
    return (ctx.stop = ctx);
  } finally {
    is_stop_signal = 0;
  }
}

function def_format(
  ctx: any,
  get: any,
  set?: any,
  no_update?: any,
  readonly_val?: any,
  has_to?: any
) {
  if (!Array.isArray(ctx)) {
    ctx[Symbol.iterator] = function* () {
      yield get;
      if (set) yield set;
    };
  }
  ctx[0] = get;
  ctx.get = get;

  const val_prop = { get } as any;
  if (set) {
    ctx[1] = set;
    if (!no_update) {
      ctx.update = (fn: any) => set(fn(get()));
    }
    ctx.set = set;
    if (!readonly_val) val_prop.set = set;

    ctx.sub = (s: any, fn: any) => on(s, (v, v_prev) => set(fn ? fn(get(), v, v_prev) : const_undef));
    ctx.sub.once = (s: any, fn: any) =>
      once(s, (v, v_prev) => set(fn ? fn(get(), v, v_prev) : const_undef));
  }
  def_prop(ctx, key, val_prop);

  if (has_to) {
    ctx.to = (value: any) => (wrap as any)(ctx, () => value);
  }
  if (set) {
    ctx.wrap = (set: any, get: any) => wrap(ctx, set, get);
    ctx.wrap.filter = (fn: any) => wrap(ctx, (v: any) => (fn(v) ? v : stoppable().stop()));
  }
  ctx.view = (get: any) => wrap(ctx, 0, get);
  ctx.watch = (fn: any) => on(ctx, fn);
  ctx.watch.once = (fn: any) => once(ctx, fn);

  ctx.select = (fn: any) => selector(fn ? () => fn(get()) : get);

  ctx.flow = {};
  ctx.flow.filter = (fn: any) => flow_filter(ctx, fn);
}

function def_promisify(ctx: any) {
  let resolve;
  const promise = new Promise(r => (resolve = r));
  ['then', 'catch', 'finally'].forEach(prop => {
    ctx[prop] = (promise as any)[prop].bind(promise);
  });
  return resolve;
}

function wrap(target: any, set?: any, get?: any) {
  const source_get = target[0];
  const source_set = target[1];

  let dest: any;
  let dest_set: any;

  if (set) {
    dest = dest_set = function (data?: any) {
      const finish = untrack();
      const stack = stoppable_context;
      stoppable_context = 1;

      try {
        data = set(data);
        if (stoppable_context === 1 || !stoppable_context[0]()) source_set(data);
      } finally {
        stoppable_context = stack;
        finish();
      }
    };
  } else if (source_set) {
    dest = function (data?: any) {
      source_set(data);
    };
  } else {
    dest = [];
  }

  if (target.then) {
    const methods = ['catch', 'finally'];
    if (get) {
      def_prop(dest, 'then', {
        get() {
          const promise = target.then(get);
          return promise.then.bind(promise);
        },
      });
    } else {
      methods.push('then');
    }
    methods.forEach(prop => {
      def_prop(dest, prop, {
        get: () => target[prop],
      });
    });
  }

  if (target.reset) dest.reset = target.reset;
  if (target.stop) target.stop = target;

  def_format(
    dest,
    get ? () => get(source_get()) : source_get,
    dest_set || source_set,
    !target.update,
    target.then,
    target.to
  );

  return dest;
}

function flow_filter<T>(target: Reactionable<T>, fn: (data: T) => boolean) {
  const f = (target as any).then ? signal<T>() : value<T>();
  on(target, v => {
    if (fn(v)) f(v);
  });
  return f;
}

function loop(body: () => Promise<any>) {
  let running = 1;
  const fn = async () => {
    while (running) await body();
  };
  const unsub = () => {
    if (running) running = 0;
  };
  un(unsub);
  fn();
  return unsub;
}

function stoppable(): StopSignal {
  if (!stoppable_context) throw new Error('Parent context not found');
  if (stoppable_context === 1) stoppable_context = stop_signal();
  return stoppable_context;
}

function pool<K extends () => Promise<any>>(body: K): Pool<K> {
  const threads = value([]);
  const count = threads.select(t => t.length);
  const pending = count.select(c => c > 0);

  function run(this: any) {
    const stop = stop_signal();
    isolate(threads.sub.once(stop, t => t.filter(ctx => ctx !== stop)));
    threads.update(t => t.concat(stop as any));

    const stack = stoppable_context;
    stoppable_context = stop;

    let ret;
    try {
      ret = (body as any).apply(this, arguments);
    } finally {
      stoppable_context = stack;

      if (ret && ret.finally) {
        ret.finally(stop);
      } else {
        stop();
      }
    }
    return ret;
  }
  run.count = count;
  run.threads = threads;
  run.pending = pending;

  return run as any;
}

function on<T>(
  target: Reactionable<Ensurable<T>>,
  listener: (value: T, prev: Ensurable<T>) => void
): () => void;
function on<T>(target: Reactionable<T>, listener: (value: T, prev: T) => void): () => void;
function on(target: any, listener: (value: any, prev?: any) => void): () => void {
  const sync_mode = is_sync;
  let free: (() => void) | undefined;

  is_sync = 0;

  if (target[0]) {
    target = target[0]; // box or selector or custom reactive
  } else {
    [target, free] = sel(target);
  }

  let value: any;

  const [run, stop] = expr(target, () => {
    const prev = value;
    listener((value = run()), prev);
  });
  value = run();
  const unsub = () => {
    if (free) free();
    stop();
  };
  un(unsub);
  if (sync_mode) listener(value);
  return unsub;
}

on.once = once;

function once<T>(
  target: Reactionable<Ensurable<T>>,
  listener: (value: T, prev: Ensurable<T>) => void
): () => void;
function once<T>(target: Reactionable<T>, listener: (value: T, prev: T) => void): () => void;
function once(target: any, listener: (value: any, prev?: any) => void): () => void {
  const unsub = on(target, (value, prev) => {
    try {
      listener(value, prev);
    } finally {
      unsub();
    }
  });
  return unsub;
}

function sync<T>(target: Reactionable<T>, listener: (value: T, prev: T) => void): () => void {
  is_sync = 1;
  return on(target, listener);
}


function cycle(body: () => void) {
  const iter = () => {
    const stack = stoppable_context;
    stoppable_context = stop_signal();
    isolate(once(stoppable_context, stop));
    try {
      run();
    } finally {
      stoppable_context = stack;
    }
  };

  const [run, stop] = expr(body, iter);
  iter();
  return un(stop);
}

function isolate(): () => () => void;
function isolate(fn: () => void): () => void;
function isolate(fn?: any) {
  if (fn) {
    if (context_unsubs) context_unsubs = context_unsubs.filter((i: any) => i !== fn);
    return fn;
  }
  const stack = context_unsubs;
  context_unsubs = [];
  return () => {
    const unsubs = context_unsubs;
    context_unsubs = stack;
    return () => {
      if (unsubs) call_array(unsubs);
    };
  };
}








function initial(data: any): void {
  initial_data = data;
}

function mock<M>(target: (new (init?: any) => M) | ((init?: any) => M), mocked: M): M {
  shareds.set(target, mocked);
  return mocked;
}

function unmock(
  target: (new (init?: any) => any) | ((init?: any) => any),
  ...targets: ((new (init?: any) => any) | ((init?: any) => any))[]
) {
  targets.concat(target).forEach(target => shareds.delete(target));
}

function shared<M>(target: (new (init?: any) => M) | ((init?: any) => M)): M {
  let instance = shareds.get(target);
  if (!instance) {
    const h = inst(target, [initial_data]);
    instance = h[0];
    shared_unsubs.push(h[1]);
    shareds.set(target, instance);
  }
  return instance;
}

function inst<M, K extends any[]>(
  target: (new (...args: K) => M) | ((...args: K) => M),
  args: K,
  hooks_available?: any
): [M, () => void, (() => void)[]] {
  let instance, unsub, hooks;
  const collect = isolate();
  const track = untrack();
  const stack = context_hooks;
  context_hooks = [];
  try {
    instance =
      typeof target.prototype === 'undefined'
        ? (target as any)(...args)
        : new (target as any)(...args);
    if (!hooks_available && context_hooks.length > 0) throw_hook_error();
  } finally {
    unsub = collect();
    track();
    hooks = context_hooks;
    context_hooks = stack;
  }
  return [instance, unsub, hooks];
}

function throw_hook_error() {
  throw new Error('Hook section available only at useLocal');
}

function hook(fn: () => void): void {
  if (!context_hooks) throw_hook_error();
  fn && context_hooks.push(fn);
}

function call_array(arr: (() => void)[]) {
  arr.forEach(fn => fn());
}

function get_scope_context(): Context<any> {
  return scope_context ? scope_context : (scope_context = (createContext as any)());
}

function useForceUpdate() {
  return useReducer(() => [], [])[1] as () => void;
}

function observe<T extends FC>(FunctionComponent: T): T {
  return function (this: any) {
    const forceUpdate = useForceUpdate();
    const ref = useRef<[T, () => void]>();
    if (!ref.current) ref.current = expr(FunctionComponent, forceUpdate);
    useEffect(() => ref.current![1], []);

    const stack = is_observe;
    is_observe = 1;
    try {
      return (ref.current[0] as any).apply(this, arguments);
    } finally {
      is_observe = stack;
    }
  } as any;
}

const Scope: FC = ({ children }) => {
  const h = useMemo(() => [new Map(), [], []], []) as any;
  useEffect(() => () => call_array(h[1]), []);
  return createElement(get_scope_context().Provider, { value: h }, children);
};

function useScoped<M>(target: (new (init?: any) => M) | ((init?: any) => M)): M {
  const context_data = useContext(get_scope_context());
  if (!context_data) {
    throw new Error('"Scope" parent component didn\'t find');
  }

  let instance;
  if (context_data[0].has(target)) {
    instance = context_data[0].get(target);
  } else {
    const h = inst(target, [initial_data]);
    context_data[0].set(target, (instance = h[0]));
    context_data[1].push(h[1]);
  }

  return instance;
}

function useLocal<T extends unknown[], M>(
  target: (new (...args: T) => M) | ((...args: T) => M),
  deps = ([] as unknown) as T
): M {
  const h = useMemo(() => {
    const i = inst(target, deps, 1);
    const call_hooks = () => call_array(i[2]);
    return [i[0], () => i[1], call_hooks] as any;
  }, deps);
  h[2]();

  useEffect(h[1], [h]);
  return h[0];
}

function useValue<T>(target: Reactionable<T>, deps: any[] = []): T {
  const forceUpdate = is_observe || useForceUpdate();
  const h = useMemo(() => {
    if (!target) return [target, () => {}];
    if ((target as any)[0]) target = (target as any)[0]; // box or selector or custom reactive

    if (typeof target === 'function') {
      if (is_observe) {
        return [target, 0, 1];
      } else {
        const [run, stop] = expr(target as any, () => {
          forceUpdate();
          run();
        });
        run();
        return [target, () => stop, 1];
      }
    } else {
      return [target as any, () => {}];
    }
  }, deps);

  is_observe || useEffect(h[1], [h]);
  return h[2] ? h[0]() : h[0];
}

function free() {
  try {
    call_array(shared_unsubs);
  } finally {
    shareds.clear();
    initial_data = const_undef;
  }
}

const obj_def_box_prop = (o: any, p: string | number | symbol, init?: any): any => {
  const b = box(init && init());
  obj_def_prop(o, p, { get: b[0], set: b[1] });
}

function prop(_proto: any, key: any, descriptor?: any): any {
  const initializer = descriptor?.initializer;
  return {
    get() {
      obj_def_box_prop(this, key, initializer);
      return this[key];
    },
    set(value: any) {
      obj_def_box_prop(this, key, initializer);
      this[key] = value;
    },
  };
}

function cache(_proto: any, key: any, descriptor: any): any {
  return {
    get() {
      const [get] = sel(descriptor.get);
      obj_def_prop(this, key, { get });
      return this[key];
    },
  };
}
