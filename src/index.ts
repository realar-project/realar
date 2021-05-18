import React, { Context, FC } from 'react';
import { expr, box, sel, flow, transaction, untrack } from 'reactive-box';

export {
  value,
  selector,
  prop,
  cache,
  signal,
  ready,
  on,
  effect,
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
  [] think about trigger implementation
    [] add "is_touched" flag to "[key_handler]" necessary for disallow setting for trigger (until reset),
        and for .touched implementation (same as dirty)

  [] value.trigger
  [] value.trigger.flag // (false -> true)
  [] value.trigger.flag.invert // (true -> false)
  [] value.from
  [] value.trigger.flag.from
  [] signal
  [] v.as.value(), v.as.signal()
  [] add signal support to "flow"
  [] x.combine([a,b,c]) -> [x,a,b,c]
  [] x.select.multiple({a:fn, b:fn}).op((ctx)=> {ctx.a.to(m); ctx.b.to(p)})
  [] x.op
  [] ...
  [] combine as root level exportable factory function
  [] flow as root level exportable factory function

  Backlog
  [] .view.untrack
  [] .pre.untrack
  [] .pre.filter.untrack
  [] .pre.filter.not.untrack
  [] v.as.readonly()
  [] flow.resolve
  [] .chan
  [] .combine
*/





//
//  Global js sdk specific definitions.
//

const obj_equals = Object.is;
const obj_def_prop = Object.defineProperty;
const obj_create = Object.create;
const new_symbol = Symbol;


//
//  Reactive box flow section. An additional abstraction in front of basic api.
//

const flow_stop = flow.stop;

//
//  Entity builder for value, signal and etc.
//

const pure_fn = function () {};
const pure_arrow_fn_returns_arg = (v) => v;
const pure_arrow_fn_returns_not_arg = (v) => !v;

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
const key_is_trigger = new_symbol();

const obj_def_prop_value = (obj, key, value) => (
  obj_def_prop(obj, key, { value }), value
);

const obj_def_prop_trait = (obj, key, trait) =>
  obj_def_prop(obj, key, {
    get() {
      return obj_def_prop_value(this, key, trait.bind(void 0, this));
    }
  });

const obj_def_prop_trait_ns = (obj, key, trait) =>
  obj_def_prop(obj, key, {
    get() {
      return obj_def_prop_value(this, key, trait.bind(void 0, this[key_ctx]));
    }
  });

const obj_def_prop_trait_ns_with_ns = (obj, key, trait, ns) =>
  obj_def_prop(obj, key, {
    get() {
      const ctx = this[key_ctx];
      const ret = trait.bind(void 0, ctx);
      ret[key_proto] = ns;
      ret[key_ctx] = ctx;
      return obj_def_prop_value(this, key, ret);
    }
  });

const obj_def_prop_trait_with_ns = (obj, key, trait, ns) =>
  obj_def_prop(obj, key, {
    get() {
      const ret = trait.bind(void 0, this);
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
            if (!ctx[key_handler][key_is_trigger]) ctx[key_promise_internal] = 0;
            resolve(ctx[key_get]());
          })[0]()
        );
      }
      return ctx[key_promise_internal];
    }
  });
};


const fill_entity = (handler, proto, has_initial?, initial?, _get?, _set?, is_trigger?) => {
  const set = _set || handler[1];
  const get = _get || handler[0];
  has_initial && (handler[key_initial] = initial);
  is_trigger && (handler[key_is_trigger] = is_trigger);

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



const trait_ent_update = (ctx, fn) => (ctx[key_set](fn && fn(ctx[key_get]())));
const trait_ent_update_by = (ctx, src, fn) => {
  const src_get = src[key_get] ? src[key_get] : src;
  const e = expr(src_get, fn
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
const trait_ent_sync = (ctx, fn) => {
  let prev_value;
  const sync = () => {
    try { fn(ctx[key_get](), prev_value); }
    finally { prev_value = e[0](); }
  };
  const e = expr(ctx[key_get], sync);
  sync();
  return ctx;
};
const trait_ent_reset = (ctx) => {
  ctx[key_promise_internal] = 0;
  ctx[key_handler][1](ctx[key_handler][key_initial]);
};
const trait_ent_reset_by = (ctx, src) => {
  const src_get = src[key_get] ? src[key_get] : src;
  const e = expr(src_get, () => {
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
  const src_get = src[key_get] ? src[key_get] : src;
  const e = expr(src_get, () => {
    trait_ent_reinit(ctx, src_get());
    e[0]();
  });
  e[0]();
  return ctx;
};
const trait_ent_to = (ctx, fn) => {
  let prev_value;
  const e = expr(ctx[key_get], () => {
    try { fn(ctx[key_get](), prev_value); }
    finally { prev_value = e[0](); }
  });
  prev_value = e[0]();
  return ctx;
};
const trait_ent_to_once = (ctx, fn) => {
  let prev_value;
  const e = expr(ctx[key_get], () => fn(ctx[key_get](), prev_value));
  prev_value = e[0]();
  return ctx;
};
const trait_ent_select = (ctx, fn) => (
  fill_entity(sel(fn ? () => fn(ctx[key_get]()) : ctx[key_get]).slice(0, 1), proto_entity_readable)
);
const trait_ent_view = (ctx, fn) => (
  fill_entity(ctx[key_handler], ctx[key_proto],
    0, 0,
    fn ? () => fn(ctx[key_get]()) : ctx[key_get],
    ctx[key_set].bind()
  )
);
const trait_ent_pre = (ctx, fn) => (
  fn
    ? fill_entity(ctx[key_handler], ctx[key_proto],
      0, 0,
      ctx[key_get],
      (v) => ctx[key_set](fn(v))
    )
    : ctx
);
const trait_ent_pre_filter = (ctx, fn) => (
  (fn = fn
    ? (fn[key_get] ? fn[key_get] : fn)
    : pure_arrow_fn_returns_arg
  ), fill_entity(ctx[key_handler], ctx[key_proto],
    0, 0,
    ctx[key_get],
    (v) => fn(v) && ctx[key_set](v)
  )
);
const trait_ent_pre_filter_not = (ctx, fn) => (
  trait_ent_pre_filter(ctx, fn
    ? (fn[key_get]
      ? (v) => !fn[key_get](v)
      : (v) => !fn(v))
    : pure_arrow_fn_returns_not_arg)
);

const trait_ent_flow = (ctx, fn) => {
  let started, prev;
  const f = flow(() => {
    const v = ctx[key_get]();
    try { return fn(v, prev) }
    finally { prev = v }
  });
  const h = [
    () => ((started || (f[0](), (started = true))), f[1]()),
    ctx[key_set] && ctx[key_set].bind()
  ];
  return fill_entity(h,
    h[1] ? proto_entity_writtable : proto_entity_readable
  );
};
const trait_ent_flow_filter = (ctx, fn) => (
  trait_ent_flow(ctx, fn
    ? (fn[key_get] && (fn = fn[key_get]),
      (v, prev) => (
        fn(v, prev) ? v : flow_stop
      ))
    : (v) => v || flow_stop
  )
);
const trait_ent_flow_filter_not = (ctx, fn) => (
  trait_ent_flow_filter(ctx, fn
    ? (fn[key_get] && (fn = fn[key_get]), (v) => !fn(v))
    : pure_arrow_fn_returns_not_arg)
);



// readable.to:ns
//   .to.once
const proto_entity_readable_to_ns = obj_create(pure_fn);
obj_def_prop_trait_ns(proto_entity_readable_to_ns, key_once, trait_ent_to_once);

// readable.flow.filter:ns
//   .flow.filter.not
const proto_entity_writtable_flow_filter_ns = obj_create(pure_fn);
obj_def_prop_trait_ns(proto_entity_writtable_flow_filter_ns, key_not, trait_ent_flow_filter_not);

// readable.flow:ns
//   .flow.filter:readable.flow.filter:ns
const proto_entity_readable_flow_ns = obj_create(pure_fn);
obj_def_prop_trait_ns_with_ns(
  proto_entity_readable_flow_ns,
  key_filter,
  trait_ent_flow_filter,
  proto_entity_writtable_flow_filter_ns
);

// readable
//   .sync
//   .to:readable.to:ns
//     .to.once
//   .flow:readable.flow:ns
//     .flow.filter:readable.flow.filter:ns
//       flow.filter.not
//   .select
//   .view
//   .promise
const proto_entity_readable = obj_create(pure_fn);
obj_def_prop_trait(proto_entity_readable, key_sync, trait_ent_sync);
obj_def_prop_trait_with_ns(
  proto_entity_readable,
  key_to,
  trait_ent_to,
  proto_entity_readable_to_ns
);
obj_def_prop_trait_with_ns(
  proto_entity_readable,
  key_flow,
  trait_ent_flow,
  proto_entity_readable_flow_ns
);
obj_def_prop_trait(proto_entity_readable, key_select, trait_ent_select);
obj_def_prop_trait(proto_entity_readable, key_view, trait_ent_view);
obj_def_prop_promise(proto_entity_readable);

// writtable.update:ns
//   .update.by
const proto_entity_writtable_update_ns = obj_create(pure_fn);
obj_def_prop_trait_ns(proto_entity_writtable_update_ns, key_by, trait_ent_update_by);

// writtable.pre.filter:ns
//   .pre.filter.not
const proto_entity_writtable_pre_filter_ns = obj_create(pure_fn);
obj_def_prop_trait_ns(proto_entity_writtable_pre_filter_ns, key_not, trait_ent_pre_filter_not);

// writtable.pre:ns
//   .pre.filter:writtable.pre.filter:ns
const proto_entity_writtable_pre_ns = obj_create(pure_fn);
obj_def_prop_trait_ns_with_ns(
  proto_entity_writtable_pre_ns,
  key_filter,
  trait_ent_pre_filter,
  proto_entity_writtable_pre_filter_ns
);

// writtable <- readable
//   .update:writtable.update:ns
//     .update.by
//   .pre:writtable.pre:ns
//     .pre.filter:writtable.pre.filter:ns
//       pre.filter.not
const proto_entity_writtable = obj_create(proto_entity_readable);
obj_def_prop_trait_with_ns(
  proto_entity_writtable,
  key_update,
  trait_ent_update,
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

// // writtable_value <- writtable_leaf
// //   .promise `for non trigger
// const proto_entity_writtable_value = obj_create(
//   proto_entity_writtable_leaf
// );
// obj_def_prop_promise(proto_entity_writtable_value);

// // writtable_value_trigger <- writtable_leaf
// //   .promise `for trigger
// const proto_entity_writtable_value_trigger = obj_create(
//   proto_entity_writtable_leaf
// );
// obj_def_prop_promise_for_trigger(
//   proto_entity_writtable_value_trigger
// );



export const _value = (initial) => (
  fill_entity(box(initial), proto_entity_writtable_leaf, 1, initial)
);

export const _value_trigger = (initial) => (
  fill_entity(box(initial), proto_entity_writtable_leaf, 1, initial, 0, 0, 1)
)





























































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

    ctx.sub = (s: any, fn: any) => on(s, (v, v_prev) => set(fn ? fn(get(), v, v_prev) : void 0));
    ctx.sub.once = (s: any, fn: any) =>
      once(s, (v, v_prev) => set(fn ? fn(get(), v, v_prev) : void 0));
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

function effect(fn: () => void): () => void;
function effect(fn: () => () => any): () => any;
function effect(fn: any) {
  return un(fn());
}

function un(unsub: () => void): () => void {
  if (unsub && context_unsubs) context_unsubs.push(unsub);
  return unsub;
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
    initial_data = void 0;
  }
}

function box_property(o: any, p: string | number | symbol, init?: any): any {
  const b = box(init && init());
  def_prop(o, p, { get: b[0], set: b[1] });
}

function prop(_proto: any, key: any, descriptor?: any): any {
  const initializer = descriptor?.initializer;
  return {
    get() {
      box_property(this, key, initializer);
      return this[key];
    },
    set(value: any) {
      box_property(this, key, initializer);
      this[key] = value;
    },
  };
}

function cache(_proto: any, key: any, descriptor: any): any {
  return {
    get() {
      const [get] = sel(descriptor.get);
      def_prop(this, key, { get });
      return this[key];
    },
  };
}
