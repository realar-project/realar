import React, { Context, FC } from 'react';
import rb from 'reactive-box';
import { Contextual, Isolate, Local, Observe, PoolEntry, SelectorEntry, SignalEntry, Transaction, Untrack, UseJsx, UseLocal, UseScoped, UseValue, UseValues, ValueEntry } from './types';

/*
  TODOs

  [] Add callback to join, and combine. After It possible to use object config for join with callback
*/


//
// Exports
//

export {
  // Declarative framework
  value,
  selector,
  signal,

  // Imperative framework
  on,
  sync,
  cycle,

  // Class decorators for TRFP
  prop,
  cache,

  // Shared technique
  shared,
  initial,
  free,
  mock,
  unmock,

  // Unsubscribe scopes control
  isolate,
  un,

  // Additional api
  local,
  contextual,
  pool,

  // Track and transactions
  transaction,
  untrack,

  // React bindings
  observe,
  useValue,
  useValues,
  useLocal,
  useScoped,
  shared as useShared,
  Scope,
  useJsx,
};


//
// React optional require
//

let react;

let useRef: typeof React.useRef;
let useReducer: typeof React.useReducer;
let useEffect: typeof React.useEffect;
let useMemo: typeof React.useMemo;
let useContext: typeof React.useContext;
let createContext: typeof React.createContext;
let createElement: typeof React.createElement;
let memo: typeof React.memo;

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
  memo = react.memo;
} catch (e) {
  useRef = useReducer = useEffect = useMemo = useContext = createContext = createElement = memo = (() => {
    throw new Error('Missed "react" dependency');
  }) as any;
}


//
// Global Realar definitions
//


const shareds = new Map();

let initial_data: any;
let shared_unsubs = [] as any;

let context_unsubs: any;
let context_local_injects: any;
let context_contextual_stop: any;


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
const const_string_function = 'function';

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
//  Entity builder implementation for value, signal and etc.
//

const pure_fn = function () {};
const pure_arrow_fn_returns_arg = (v) => v;
const pure_arrow_fn_returns_not_arg = (v) => !v;
const pure_arrow_fn_returns_undef = (() => {}) as any;

const key_proto = '__proto__';
const key_get = 'get';
const key_set = 'set';
const key_promise = 'promise';
const key_promise_internal = new_symbol();
const key_reset = 'reset';
const key_initial = new_symbol();
const key_dirty_handler = new_symbol();
const key_dirty = 'dirty';
const key_sync = 'sync';
const key_ctx = new_symbol();
const key_by = 'by';
const key_reinit = 'reinit';
const key_update = 'update';
const key_val = 'val';
const key_once = 'once';
const key_to = 'to';
const key_select = 'select';
const key_map = 'map';
const key_handler = new_symbol();
const key_pre = 'pre';
const key_filter = 'filter';
const key_not = 'not';
const key_flow = 'flow';
const key_reset_promise_by_reset = new_symbol();
const key_touched_internal = new_symbol();
const key_trigger = 'trigger';
const key_flag = 'flag';
const key_invert = 'invert';
const key_from = 'from';
const key_is_signal = new_symbol();
const key_track = 'track';
const key_untrack = 'un'+key_track;
const key_multiple = 'multiple';
const key_combine = 'combine';
const key_join = 'join';
const key_value = 'value';
const key_as = 'as';
const key_op = 'op';
const key_inject = 'inject';
const key_stop = 'stop';
const key_unsafe = 'unsafe';
const key_updater = key_update+'r';



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


const obj_empty_from = (cfg) => obj_is_array(cfg) ? [] : {};


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
  if (is_sync) untrack(fn.bind(const_undef, value, const_undef));
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

const op_trait_if_not_signal = (trait_if_not_signal, trait_if_signal) => (
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



const trait_ent_update = (ctx, fn) => ctx[key_set](fn ? fn(untrack(ctx[key_get])) : untrack(ctx[key_get]));
const trait_ent_update_untrack = make_trait_ent_pure_fn_untrack(trait_ent_update);
const trait_ent_update_by = (ctx, src, fn) => (
  reactionable_subscribe(src, fn
    ? (src_value, src_prev_value) => ctx[key_set](fn(ctx[key_get](), src_value, src_prev_value))
    : (src_value) => ctx[key_set](src_value)
  ),
  ctx
);
const trait_ent_update_by_once = (ctx, src, fn) => (
  reactionable_subscribe(src, fn
    ? (src_value, src_prev_value) => ctx[key_set](fn(ctx[key_get](), src_value, src_prev_value))
    : (src_value) => ctx[key_set](src_value),
    1
  ),
  ctx
);
const trait_ent_updater = (ctx, fn) => {
  const sig = signal();
  trait_ent_update_by(ctx, sig, fn);
  return sig;
}
const trait_ent_updater_multiple = (ctx, cfg) => obj_keys(cfg).reduce((ret, key) => (
  (ret[key] = trait_ent_updater(ctx, cfg[key])), ret
), obj_empty_from(cfg));
const trait_ent_sync = (ctx, fn) => (reactionable_subscribe(ctx, fn, 0, 1), ctx);
const trait_ent_reset = (ctx) => {
  ctx[key_promise_internal] = 0;
  ctx[key_handler][1](ctx[key_handler][key_initial]);
  ctx[key_handler][key_touched_internal] = 0;
};
const trait_ent_reset_by = (ctx, src) => (
  reactionable_subscribe(src, trait_ent_reset.bind(const_undef, ctx)),
  ctx
);
const trait_ent_reset_by_once = (ctx, src) => (
  reactionable_subscribe(src, trait_ent_reset.bind(const_undef, ctx), 1),
  ctx
);
const trait_ent_reinit = (ctx, initial) => {
  ctx[key_handler][key_initial] = initial;
  trait_ent_reset(ctx);
};
const trait_ent_reinit_by = (ctx, src) => (
  reactionable_subscribe(src, (src_value) => trait_ent_reinit(ctx, src_value)),
  ctx
);
const trait_ent_reinit_by_once = (ctx, src) => (
  reactionable_subscribe(src, (src_value) => trait_ent_reinit(ctx, src_value), 1),
  ctx
);
const trait_ent_to = (ctx, fn) => (reactionable_subscribe(ctx, fn), ctx);
const trait_ent_to_once = (ctx, fn) => (reactionable_subscribe(ctx, fn, 1), ctx);
const trait_ent_select = (ctx, fn) => (
  fill_entity(sel(fn ? () => fn(ctx[key_get]()) : ctx[key_get]).slice(0, 1), proto_entity_readable)
);
const trait_ent_select_untrack = make_trait_ent_pure_fn_untrack(trait_ent_select);
const trait_ent_select_multiple = (ctx, cfg) => obj_keys(cfg).reduce((ret, key) => (
  (ret[key] = trait_ent_select(ctx, cfg[key])), ret
), obj_empty_from(cfg));
const trait_ent_select_multiple_untrack = (ctx, cfg) => obj_keys(cfg).reduce((ret, key) => (
  (ret[key] = trait_ent_select_untrack(ctx, cfg[key])), ret
), obj_empty_from(cfg));
const trait_ent_map = (ctx, fn) => (
  fill_entity(ctx[key_handler], ctx[key_proto],
    0, 0,
    fn
      ? ctx[key_handler][key_is_signal]
        ? () => fn(ctx[key_get]())
        : sel(() => fn(ctx[key_get]()))[0]
      : ctx[key_get],
    ctx[key_set] && ctx[key_set].bind()
  )
);
const trait_ent_map_untrack = make_trait_ent_pure_fn_untrack(trait_ent_map);
const trait_ent_map_to = (ctx, val) => trait_ent_map(ctx, () => val);
const trait_ent_pre = (ctx, fn) => (
  fn
    ? fill_entity(ctx[key_handler], ctx[key_proto],
      0, 0,
      ctx[key_get],
      (v) => ctx[key_set](fn(v, untrack(ctx[key_get])))
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
  op_trait_if_not_signal(trait_ent_filter_not, trait_ent_filter_not_untrack),
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

// readable.map:ns              (track|untrack)
//   .to
const proto_entity_readable_map_ns = obj_create(
  make_proto_for_trackable_ns(trait_ent_map, trait_ent_map_untrack)
);
obj_def_prop_trait_ns(proto_entity_readable_map_ns, key_to, trait_ent_map_to);

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
//   .map:readable.map:ns       (track|untrack)
//     .to
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
  op_trait_if_not_signal(trait_ent_filter, trait_ent_filter_untrack),
  proto_entity_readable_filter_ns,
  1
);
obj_def_prop_trait_with_ns(
  proto_entity_readable,
  key_flow,
  op_trait_if_not_signal(trait_ent_flow, trait_ent_flow_untrack),
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
  key_map,
  op_trait_if_not_signal(trait_ent_map, trait_ent_map_untrack),
  proto_entity_readable_map_ns,
  1
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

// writtable.update.by:ns
//   .update.by.once
const proto_entity_writtable_update_by_ns = obj_create(pure_fn);
obj_def_prop_trait_ns(proto_entity_writtable_update_by_ns, key_once, trait_ent_update_by_once);

// writtable.update:ns          (track|untrack)
//   .update.by:writtable.update.by:ns
const proto_entity_writtable_update_ns = obj_create(
  make_proto_for_trackable_ns(trait_ent_update, trait_ent_update_untrack)
);
obj_def_prop_trait_ns_with_ns(proto_entity_writtable_update_ns, key_by, trait_ent_update_by,
  proto_entity_writtable_update_by_ns
);

// writtable.updater:ns
//   .updater.multiple
const proto_entity_writtable_updater_ns = obj_create(pure_fn);
obj_def_prop_trait_ns(proto_entity_writtable_updater_ns, key_multiple, trait_ent_updater_multiple);

// writtable.pre.filter:ns      (track|untrack)
//   .pre.filter.not            (track|untrack)
const proto_entity_writtable_pre_filter_ns = obj_create(
  make_proto_for_trackable_ns(trait_ent_pre_filter, trait_ent_pre_filter_untrack)
);
obj_def_prop_trait_ns_with_ns(proto_entity_writtable_pre_filter_ns, key_not,
  op_trait_if_not_signal(trait_ent_pre_filter_not, trait_ent_pre_filter_not_untrack),
  make_proto_for_trackable_ns(trait_ent_pre_filter_not, trait_ent_pre_filter_not_untrack),
  1
);

// writtable.pre:ns                         (track|untrack)
//   .pre.filter:writtable.pre.filter:ns    (track|untrack)
const proto_entity_writtable_pre_ns = obj_create(
  make_proto_for_trackable_ns(trait_ent_pre, trait_ent_pre_untrack)
);
obj_def_prop_trait_ns_with_ns(
  proto_entity_writtable_pre_ns,
  key_filter,
  op_trait_if_not_signal(trait_ent_pre_filter, trait_ent_pre_filter_untrack),
  proto_entity_writtable_pre_filter_ns,
  1
);

// writtable <- readable
//   .update:writtable.update:ns            (track|untrack)
//     .update.by
//   .updater:writtable.updater:ns
//     .updater.miltiple
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
  key_updater,
  trait_ent_updater,
  proto_entity_writtable_updater_ns
);
obj_def_prop_trait_with_ns(
  proto_entity_writtable,
  key_pre,
  op_trait_if_not_signal(trait_ent_pre, trait_ent_pre_untrack),
  proto_entity_writtable_pre_ns,
  1
);

// writtable_leaf.reset.by:ns
//   .reset.by.once
const proto_entity_writtable_leaf_reset_by_ns = obj_create(pure_fn);
obj_def_prop_trait_ns(proto_entity_writtable_leaf_reset_by_ns, key_once, trait_ent_reset_by_once);

// writtable_leaf.reset:ns
//   .reset.by:writtable_leaf.reset.by:ns
const proto_entity_writtable_leaf_reset_ns = obj_create(pure_fn);
obj_def_prop_trait_ns_with_ns(proto_entity_writtable_leaf_reset_ns, key_by, trait_ent_reset_by,
  proto_entity_writtable_leaf_reset_by_ns
);

// writtable_leaf.reinit.by:ns
//   .reinit.by.once
const proto_entity_writtable_leaf_reinit_by_ns = obj_create(pure_fn);
obj_def_prop_trait_ns(proto_entity_writtable_leaf_reinit_by_ns, key_once, trait_ent_reinit_by_once);

// writtable_leaf.reinit:ns
//   .reinit.by:writtable_leaf.reinit.by:ns
const proto_entity_writtable_leaf_reinit_ns = obj_create(pure_fn);
obj_def_prop_trait_ns_with_ns(proto_entity_writtable_leaf_reinit_ns, key_by, trait_ent_reinit_by,
  proto_entity_writtable_leaf_reinit_by_ns
);


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
    ? () => { handler[key_touched_internal] || handler[1](!untrack(handler[0])) }
    : (v) => { handler[key_touched_internal] || handler[1](v) };
  handler[key_reset_promise_by_reset] = 1;
  handler[key_is_signal] = is_signal;
  return fill_entity(handler, proto_entity_writtable_leaf, 1, initial, 0, set);
}

const get_getter_to_reactionable_or_custom = (re) => (
  (re && re[key_get]) || (typeof re === const_string_function ? re : () => re)
)

const make_combine = (cfg, is_signal?) => {
  const keys = obj_keys(cfg);
  const fns = keys.map(is_signal
    ? (key) => get_getter_to_reactionable_or_custom(cfg[key])
    : (key) => sel(get_getter_to_reactionable_or_custom(cfg[key]))[0]
  );
  const h = [
    () => keys.reduce((ret, key, key_index) => (
      (ret[key] = fns[key_index]()), ret
    ), obj_empty_from(cfg))
  ];
  h[key_is_signal] = is_signal;
  return fill_entity(h, proto_entity_readable);
}



const selector: SelectorEntry = (fn) => (
  fill_entity(sel(fn).slice(0, 1), proto_entity_readable)
)


const value: ValueEntry = ((initial) => (
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
value[key_trigger] = value_trigger as any;
value[key_from] = value_from;
value[key_combine] = value_combine;


const signal: SignalEntry = ((initial) => {
  const h = box(initial, 0 as any, pure_arrow_fn_returns_undef);
  h[key_is_signal] = 1;
  return fill_entity(h, proto_entity_writtable_leaf, 1, initial)
}) as any;

const signal_trigger = (initial) => make_trigger(initial, 0, 1);
const signal_trigger_flag = (initial) => make_trigger(!!initial, 1, 1);
const signal_trigger_flag_invert = (initial) => make_trigger(!initial, 1, 1);
const signal_from = (get, set?) => (
  (get = [get[key_get] || get],
  (get[key_is_signal] = 1),
  set && ((set = set[key_set] || set), (get[1] = set.bind()))),
  fill_entity(get, set ? proto_entity_writtable : proto_entity_readable)
);
const signal_combine = (cfg) => make_combine(cfg, 1);

signal_trigger_flag[key_invert] = signal_trigger_flag_invert;
signal_trigger[key_flag] = signal_trigger_flag;
signal[key_trigger] = signal_trigger as any;
signal[key_from] = signal_from;
signal[key_combine] = signal_combine;



//
// Realar internal
//

const call_fns_array = (arr) => arr.forEach(fn => fn());
const throw_local_inject_error = () => {
  throw new Error('The local.inject section available only in useLocal');
}
const internal_isolate = () => {
  const stack = context_unsubs;
  context_unsubs = [];
  return () => {
    const unsubs = context_unsubs;
    context_unsubs = stack;
    return () => unsubs && call_fns_array(unsubs);
  };
}

//
// Realar exportable api
//

const transaction = ((fn) => {
  const finish = internal_transaction();
  try { return fn() }
  finally { finish() }
}) as Transaction;
transaction[key_unsafe] = internal_transaction;

const untrack = ((fn) => {
  const finish = internal_untrack();
  try { return fn() }
  finally { finish() }
}) as Untrack;
untrack[key_unsafe] = internal_untrack;

const isolate = ((fn?: any) => {
  let unsubs;
  const finish = internal_isolate();
  try { fn() }
  finally { unsubs = finish() }
  return unsubs;
}) as Isolate;
isolate[key_unsafe] = internal_isolate;


const un = (unsub: () => void) => {
  unsub && context_unsubs && context_unsubs.push(unsub)
}


const local_inject = (fn) => {
  if (!context_local_injects) throw_local_inject_error();
  fn && context_local_injects.push(fn);
}
const local = {} as Local;
local[key_inject] = local_inject;


const on_once = (target, fn) => reactionable_subscribe(target, fn, 1);
const on = (target, fn) => reactionable_subscribe(target, fn);

on[key_once] = on_once;

const sync = (target, fn) => reactionable_subscribe(target, fn, 0, 1);

const cycle = (body) => {
  const iter = () => {
    const stack = context_contextual_stop;
    context_contextual_stop = e[1];
    try {
      e[0]();
    } finally {
      context_contextual_stop = stack;
    }
  };
  const e = un_expr(body, iter);
  iter();
}

const contextual = {} as Contextual;
obj_def_prop(contextual, key_stop, {
  get() {
    if (!context_contextual_stop) throw new Error('Parent context not found');
    return context_contextual_stop;
  }
});



//
// Shared technique abstraction
//

const initial = (data: any): void => {
  initial_data = data;
}

const inst = <M, K extends any[]>(
  target: (new (...args: K) => M) | ((...args: K) => M),
  args: K,
  local_injects_available?: any
): [M, () => void, (() => void)[]] => {
  let instance, unsub, local_injects;
  const collect = internal_isolate();
  const track = internal_untrack();
  const stack = context_local_injects;
  context_local_injects = [];
  try {
    instance =
      target.prototype === const_undef
        ? (target as any)(...args)
        : new (target as any)(...args);
    if (!local_injects_available && context_local_injects.length > 0) throw_local_inject_error();
  } finally {
    unsub = collect();
    track();
    local_injects = context_local_injects;
    context_local_injects = stack;
  }
  return [instance, unsub, local_injects];
}

const shared = <M>(target: (new (init?: any) => M) | ((init?: any) => M)): M => {
  let instance = shareds.get(target);
  if (!instance) {
    const h = inst(target, [initial_data]);
    instance = h[0];
    shared_unsubs.push(h[1]);
    shareds.set(target, instance);
  }
  return instance;
}

const free = () => {
  try {
    call_fns_array(shared_unsubs);
  } finally {
    shareds.clear();
    initial_data = const_undef;
  }
}

const mock = <M>(target: (new (init?: any) => M) | ((init?: any) => M), mocked: M): M => (
  shareds.set(target, mocked),
  mocked
)

const unmock = (
  target: (new (init?: any) => any) | ((init?: any) => any),
  ...targets: ((new (init?: any) => any) | ((init?: any) => any))[]
) => (
  targets.concat(target).forEach(target => shareds.delete(target))
)


//
// Decorator functions "prop" and "cache"
//

const obj_def_box_prop = (o: any, p: string | number | symbol, init?: any): any => (
  (init = box(init && init())),
  obj_def_prop(o, p, { get: init[0], set: init[1] })
)

const prop = (_target: any, key: any, descriptor?: any): any => (
  (_target = descriptor?.initializer), {
    get() {
      obj_def_box_prop(this, key, _target);
      return this[key];
    },
    set(value: any) {
      obj_def_box_prop(this, key, _target);
      this[key] = value;
    },
  }
)

const cache = (_target: any, key: any, descriptor: any): any => ({
  get() {
    const [get] = sel(descriptor.get);
    obj_def_prop(this, key, { get });
    return this[key];
  }
})



//
// React bindings global definitions
//

let context_is_observe: any;
let react_scope_context: any;
let observe_no_memo_flag: any;

const key_nomemo = 'nomemo';

//
// React bindings
//

const get_scope_context = (): Context<any> => (
  react_scope_context ? react_scope_context : (react_scope_context = (createContext as any)())
)

const useForceUpdate = () => (
  useReducer(() => [], [])[1] as () => void
)

const observe: Observe = ((target) => {
  function fn (this: any) {
    const force_update = useForceUpdate();
    const ref = useRef<any>();
    if (!ref.current) ref.current = expr(target, force_update);
    useEffect(() => ref.current[1], []);

    const stack = context_is_observe;
    context_is_observe = 1;
    try {
      return ref.current[0].apply(this, arguments);
    } finally {
      context_is_observe = stack;
    }
  }
  return observe_no_memo_flag
    ? ((observe_no_memo_flag = 0), fn)
    : memo(fn)
}) as any;

const observe_nomemo: Observe['nomemo'] = (target): any => (
  (observe_no_memo_flag = 1),
  observe(target)
)

observe[key_nomemo] = observe_nomemo;

const Scope: FC = ({ children }) => {
  const h = useMemo(() => [new Map(), [], []], []) as any;
  useEffect(() => () => call_fns_array(h[1]), []);
  return createElement(get_scope_context().Provider, { value: h }, children);
};

const useScoped: UseScoped = (target) => {
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

const useLocal: UseLocal = (target, deps: any) => {
  deps || (deps = []);
  const h = useMemo(() => {
    const i = inst(target, deps, 1);
    const call_local_injects = () => call_fns_array(i[2]);
    return [i[0], () => i[1], call_local_injects] as any;
  }, deps);
  h[2]();

  useEffect(h[1], [h]);
  return h[0];
}

const useValue: UseValue = (target, deps) => {
  deps || (deps = []);
  const force_update = context_is_observe || useForceUpdate();
  const h = useMemo(() => {
    if (!target) return [target, () => {}];
    if ((target as any)[key_get]) target = (target as any)[key_get];

    if (typeof target === const_string_function) {
      if (context_is_observe) {
        return [target, 0, 1];
      } else {
        const [run, stop] = expr(target as any, () => {
          force_update();
          run();
        });
        run();
        return [target, () => stop, 1];
      }
    } else {
      return [target as any, () => {}];
    }
  }, deps);

  context_is_observe || useEffect(h[1], [h]);
  return h[2] ? h[0]() : h[0];
}

const useValues: UseValues = (targets, deps):any => {
  deps || (deps = []);
  const h = useMemo(() => value.combine(targets), deps);
  return useValue(h, [h]);
};

const useJsx: UseJsx = (target, deps): any => (
  useMemo(() => observe(target as any), deps || [])
);



//
// Pool abstraction
//

const pool: PoolEntry = (body): any => {
  const threads = value([]);
  const count = threads.select(t => t.length);
  const pending = count.select(c => c > 0);

  function run(this: any) {
    const stop = () => threads.update(t => t.filter(ctx => ctx !== stop));
    threads.update(t => t.concat(stop as any));

    const stack = context_contextual_stop;
    context_contextual_stop = stop;

    let ret;
    try {
      ret = (body as any).apply(this, arguments);
    } finally {
      context_contextual_stop = stack;

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

  return run;
}


//
// End of File
// Enjoy and Happy Coding!
//
