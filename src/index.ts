import React, { Context, FC } from 'react';
import { expr, box, sel, transaction, untrack } from 'reactive-box';

export {
  value,
  selector,
  prop,
  cache,
  signal,
  ready,
  on,
  once,
  effect,
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
let shared_unsubs = [] as any;
let is_sync: any;
let no_reset: any;
let is_observe: any;
let scope_context: any;
let stoppable_context: any;

const def_prop = Object.defineProperty;

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
      (listener: (value: T, prev?: T) => void): () => void;
      once(listener: (value: T, prev?: T) => void): () => void;
    }
  };

type Value<T, K = T> = Callable<T> & {
  0: () => K;
  1: (value: T) => void;
  val: T & K;
  update: (fn: (state: K) => T) => void;

  sub: {
    <S>(reactionable: Reactionable<S>, fn: (data?: K, value?: S, prev?: S) => T): (() => void);
    once<S>(reactionable: Reactionable<S>, fn: (data?: K, value?: S, prev?: S) => T): (() => void);
  }

  get(): K;
  set(value: T): void;
} & {
  wrap<P>(set: () => T, get: (data: K) => P): Value<void, P>;
  wrap<P, M = T>(set: (data: M) => T, get: (data: K) => P): Value<M, P>;
  wrap(set: () => T): Value<void, K>;
  wrap<M = T>(set: (data: M) => T): Value<M, K>;

  filter(fn: (data: T) => any): Value<T, K>;

  view<P>(get: (data: K) => P): Value<T, P>;
  select<P>(get: (data: K) => P): Selector<P>;
  select(): Selector<K>;
  watch: {
    (listener: (value: K, prev?: K) => void): () => void;
    once(listener: (value: K, prev?: K) => void): () => void;
  }
  reset(): void;
} & {
    [P in Exclude<keyof Array<void>, 'filter' | number>]: never;
  } &
  [() => K, (value: T) => void];

type Signal<T, K = T, X = {}, E = { reset(): void }> = Callable<T> &
  Pick<Promise<T>, 'then' | 'catch' | 'finally'> & {
    0: () => K;
    1: (value: T) => void;
    readonly val: K;
    get(): K;
  } & {
    wrap<P>(set: () => T, get: (data: K) => P): Signal<void, P, X, E>;
    wrap<P, M = T>(set: (data: M) => T, get: (data: K) => P): Signal<M, P, X, E>;
    wrap(set: () => T): Signal<void, K, X, E>;
    wrap<M = T>(set: (data: M) => T): Signal<M, K, X, E>;

    filter(fn: (data: T) => any): Signal<T, K, X, E>;

    view<P>(get: (data: K) => P): Signal<T, P, X, E>;
    select<P>(get: (data: K) => P): Selector<P>;
    select(): Selector<K>;

    watch: {
      (listener: (value: K extends Ensurable<infer P> ? P : K, prev?: K) => void): () => void;
      once(listener: (value: K extends Ensurable<infer P> ? P : K, prev?: K) => void): () => void;
    }
  } & E &
  X &
  {
    [P in Exclude<keyof Array<void>, 'filter' | number>]: never;
  } &
  [() => K, (value: T) => void];

type StopSignal = Signal<
  void,
  boolean,
  {
    stop(): void;
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
  def_format(fn, () => get()[0], fn, 1);
  fn.reset = () => set([init]);
  return fn as any;
}

signal.stop = stop_signal;
signal.ready = ready;

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
  def_format(fn, () => get()[0], fn, 1, 1);

  if (!no_reset) {
    fn.reset = () => {
      resolve = def_promisify(fn);
      resolved = 0;
      set([init]);
    };
  }

  return fn as any;
}

function stop_signal(): StopSignal {
  no_reset = 1;
  try {
    const ctx = ready(false).to(true) as any;
    return (ctx.stop = ctx);
  } finally {
    no_reset = 0;
  }
}

function def_format(ctx: any, get: any, set?: any, no_set_update?: any, has_to?: any) {
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
    if (!no_set_update) {
      ctx.set = set;
      ctx.update = (fn: any) => set(fn(get()));
      val_prop.set = set;
      ctx.sub = (s: any, fn: any) => (
        on(s, (v, v_prev) => (
          set(fn(get(), v, v_prev))
        ))
      );
      ctx.sub.once = (s: any, fn: any) => (
        once(s, (v, v_prev) => (
          set(fn(get(), v, v_prev))
        ))
      );
    }
  }
  def_prop(ctx, key, val_prop);

  if (has_to) {
    ctx.to = (value: any) => (wrap as any)(ctx, () => value);
  }
  if (set) {
    ctx.wrap = (set: any, get: any) => wrap(ctx, set, get);
    ctx.filter = (fn: any) => wrap(ctx, (v: any) => (fn(v) ? v : stoppable().stop()));
  }
  ctx.view = (get: any) => wrap(ctx, 0, get);
  ctx.watch = (fn: any) => on(ctx, fn);
  ctx.watch.once = (fn: any) => once(ctx, fn);

  ctx.select = (fn: any) => selector(fn ? () => fn(get()) : get);
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
    target.to
  );

  return dest;
}

function loop(body: () => Promise<any>) {
  let running = 1;
  const fn = async () => {
    while (running) await body();
  };
  const unsub = () => {
    if (running) running = 0;
  };
  if (context_unsubs) context_unsubs.push(unsub);
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

  function run() {
    const stop = stop_signal();
    isolate(threads.sub.once(stop, t => t.filter(ctx => ctx !== stop)));
    threads.update(t => t.concat(stop));

    const stack = stoppable_context;
    stoppable_context = stop;

    let ret;
    try {
      ret = body.apply(this, arguments);
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
  listener: (value: T, prev?: T) => void
): () => void;
function on<T>(target: Reactionable<T>, listener: (value: T, prev?: T) => void): () => void;
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
  if (context_unsubs) context_unsubs.push(unsub);
  if (sync_mode) listener(value);
  return unsub;
}

on.once = once;

function once<T>(
  target: Reactionable<Ensurable<T>>,
  listener: (value: T, prev?: T) => void
): () => void;
function once<T>(target: Reactionable<T>, listener: (value: T, prev?: T) => void): () => void;
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

function sync<T>(target: Reactionable<T>, listener: (value: T, prev?: T) => void): () => void {
  is_sync = 1;
  return on(target, listener);
}

function effect(fn: () => void): () => void;
function effect(fn: () => () => any): () => any;
function effect(fn: any) {
  const unsub = fn();
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
  if (context_unsubs) context_unsubs.push(stop);
  return stop;
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
  args: K
): [M, () => void] {
  let instance;
  const collect = isolate();
  const track = untrack();
  try {
    instance =
      typeof target.prototype === 'undefined'
        ? (target as any)(...args)
        : new (target as any)(...args);
  } finally {
    track();
    return [instance, collect()];
  }
}

function call_array(arr: (() => void)[]) {
  arr.forEach(fn => fn());
}

function get_scope_context(): Context<any> {
  return scope_context ? scope_context : (scope_context = (createContext as any)());
}

function useScoped<M>(
  target: (new (init?: any) => M) | ((init?: any) => M)
): M {
  const context_data = useContext(get_scope_context());
  if (!context_data) {
    throw new Error('"Scope" parent component didn\'t find');
  }

  let instance;
  if (context_data[0].has(target)) {
    instance = context_data[0].get(target);
  } else {
    const h = inst(target, [initial_data]);
    instance = h[0];
    context_data[1].push(h[1]);

    context_data[0].set(target, instance);
  }
  return instance;
}

const Scope: FC = ({ children }) => {
  const h = useMemo(() => [new Map(), []], []) as any;
  useEffect(() => () => call_array(h[1]), []);
  return createElement(get_scope_context().Provider, { value: h }, children);
};

function useForceUpdate() {
  return useReducer(() => [], [])[1] as () => void;
}

function observe<T extends FC>(FunctionComponent: T): T {
  return function () {
    const forceUpdate = useForceUpdate();
    const ref = useRef<[T, () => void]>();
    if (!ref.current) ref.current = expr(FunctionComponent, forceUpdate);
    useEffect(() => ref.current![1], []);

    const stack = is_observe;
    is_observe = 1;
    try {
      return ref.current[0].apply(this, arguments);
    } finally {
      is_observe = stack;
    }
  } as any;
}

function useLocal<T extends unknown[], M>(
  target: (new (...args: T) => M) | ((...args: T) => M),
  deps = [] as T
): M {
  const h = useMemo(() => {
    const i = inst(target, deps);
    return [i[0], () => i[1]] as any;
  }, deps);

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
