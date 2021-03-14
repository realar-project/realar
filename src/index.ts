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
  wrap,
  isolate,
  shared,
  initial,
  observe,
  useValue,
  useLocal,
  useShared,
  useScoped,
  Scope,
  free,
  mock,
  unmock,
  transaction,
  untrack,
  Ensurable,
};

let react;

try {
  react = require('react');
} catch (e) {}

let useRef: typeof React.useRef;
let useReducer: typeof React.useReducer;
let useEffect: typeof React.useEffect;
let useMemo: typeof React.useMemo;
let useContext: typeof React.useContext;
let createContext: typeof React.createContext;
let createElement: typeof React.createElement;

/* istanbul ignore next */
if (react) {
  useRef = react.useRef;
  useReducer = react.useReducer;
  useEffect = react.useEffect;
  useMemo = react.useMemo;
  useContext = react.useContext;
  createContext = react.createContext;
  createElement = react.createElement;
} else {
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
let is_observe: any;
let scope_context: any;
let stoppable_context: any;

const def_prop = Object.defineProperty;

type Ensurable<T> = T | void;

type Callable<T> = {
  (data: T): void;
} & (T extends void
  ? {
      (): void;
    }
  : {});

type Selector<T> = {
  0: () => T;
  readonly val: T;
  get(): T;
  free(): void;
} & [() => T];

type Value<T, K = T> = Callable<T> & {
  0: () => K;
  1: (value: T) => void;
  val: T & K;
  update: (fn: (state: K) => T) => void;
  get(): K;
  set(value: T): void;
} & [() => K, (value: T) => void];

type Signal<T, K = T> = Callable<T> &
  Pick<Promise<T>, 'then' | 'catch' | 'finally'> & {
    0: () => K;
    1: (value: T) => void;
    readonly val: K;
    get(): K;
  } & [() => K, (value: T) => void];

type Reactionable<T> = { 0: () => T } | [() => T] | (() => T);

function value<T = void>(): Value<T>;
function value<T = void>(init: T): Value<T>;
function value(init?: any): any {
  const [get, set] = box(init) as any;
  def_format(set, get, set);
  return set;
}

function selector<T>(body: () => T): Selector<T> {
  const [get, free] = sel(body);
  const h = def_format([], get);
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

  def_format(fn, () => get()[0], fn, 1);
  resolve = def_promisify(fn);

  return fn as any;
}

function ready<T = void>(): Signal<T, Ensurable<T>>;
function ready<T = void>(init: T): Signal<T>;
function ready<T = void>(init: T, to: T): Signal<void, T>;
function ready(init?: any, to?: any) {
  let resolved = 0;
  let resolve: any;
  const [get, set] = box([init]);
  const has_to = arguments.length > 1;

  const fn = function (data: any) {
    if (!resolved) {
      resolved = 1;
      if (has_to) data = to;
      set([data]);
      resolve(data);
    }
  };

  def_format(fn, () => get()[0], fn, 1);
  resolve = def_promisify(fn);

  return fn as any;
}

function def_format(ctx: any, get: any, set?: any, no_set_update?: any) {
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
    }
  }
  def_prop(ctx, key, val_prop);
  return ctx;
}

function def_promisify(ctx: any) {
  let resolve;
  const promise = new Promise(r => (resolve = r));
  ['then', 'catch', 'finally'].forEach(prop => {
    ctx[prop] = (promise as any)[prop].bind(promise);
  });
  return resolve;
}

function stop_signal() {
  return ready(false, true);
}

function wrap<T, K, P>(target: Signal<T, K>, set: () => T, get: (data: K) => P): Signal<void, P>;
function wrap<T, K, P, M = T>(
  target: Signal<T, K>,
  set: (data: M) => T,
  get: (data: K) => P
): Signal<M, P>;

function wrap<T, K>(target: Signal<T, K>, set: () => T): Signal<void, K>;
function wrap<T, K, M = T>(target: Signal<T, K>, set: (data: M) => T): Signal<M, K>;

function wrap<T, K, P>(target: Value<T, K>, set: () => T, get: (data: K) => P): Value<void, P>;
function wrap<T, K, P, M = T>(
  target: Value<T, K>,
  set: (data: M) => T,
  get: (data: K) => P
): Value<M, P>;
function wrap<T, K>(target: Value<T, K>, set: () => T): Signal<void, K>;
function wrap<T, K, M = T>(target: Value<T, K>, set: (data: M) => T): Signal<M, K>;

function wrap<M, T>(target: Selector<T>, get: (data: T) => M): Selector<M>;

function wrap(target: any, set?: any, get?: any) {
  let source_get: any, source_set: any;
  if (target[0]) {
    source_get = target[0];
    if (target[1]) source_set = target[1];
  }
  if (!get && set && !source_set) {
    get = set;
    set = 0;
  }
  if ((set && !source_set) || (get && !source_get)) {
    throw new Error('Incorrect wrapping target');
  }

  let dest: any;
  let dest_set: any;

  if (set) {
    dest = dest_set = function (data?: any) {
      const finish = untrack();
      const stack = stoppable_context;
      stoppable_context = stop_signal();

      try {
        data = set(data);
        if (!stoppable_context[0]()) source_set(data);
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

  return def_format(
    dest,
    get ? () => get(source_get()) : source_get,
    dest_set || source_set,
    !target.update
  );
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

type Pool<K> = K & {
  count: number;
  threads: StopSignal[];
  pending: boolean;
};

type StopSignal = Signal<void, boolean>;

function stoppable(): StopSignal {
  if (!stoppable_context) throw new Error('Parent "pool" or "wrap" didn\'t find');
  return stoppable_context;
}

function pool<K extends () => Promise<any>>(body: K): Pool<K> {
  const [get_threads, set_threads] = box([]);
  const get_count = () => get_threads().length;
  const [get_pending] = sel(() => get_count() > 0);

  function run() {
    const stop = stop_signal();
    const isolate_finish = isolate();
    once(stop, () => set_threads(get_threads().filter(ctx => ctx !== stop)));
    isolate_finish();

    set_threads(get_threads().concat(stop));

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

  def_prop(run, 'count', { get: get_count });
  def_prop(run, 'threads', { get: get_threads });
  def_prop(run, 'pending', { get: get_pending });

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

function effect(fn: () => void): void;
function effect(fn: () => () => any): () => any;
function effect(fn: any) {
  const unsub = fn();
  if (unsub && context_unsubs) context_unsubs.push(unsub);
  return unsub;
}

function cycle(body: () => void) {
  const [run, stop] = expr(body);
  run();
  if (context_unsubs) context_unsubs.push(stop);
  return stop;
}

function isolate() {
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
  target: (new (init?: any) => M | Reactionable<M>) | ((init?: any) => M | Reactionable<M>)
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
  return useValue(instance);
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
  target: (new (...args: T) => M | Reactionable<M>) | ((...args: T) => M | Reactionable<M>),
  deps = [] as T
): M {
  const h = useMemo(() => {
    const i = inst(target, deps);
    return [i[0], () => i[1]] as any;
  }, deps);

  useEffect(h[1], [h]);
  return useValue(h[0], [h]);
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

function useShared<M>(
  target: (new (init?: any) => M | Reactionable<M>) | ((init?: any) => M | Reactionable<M>)
): M {
  return useValue(shared(target as any));
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
  const b = box(init);
  def_prop(o, p, { get: b[0], set: b[1] });
}

function prop(_proto: any, key: any, descriptor?: any): any {
  const initializer = descriptor?.initializer;
  return {
    get() {
      box_property(this, key, initializer && initializer());
      return this[key];
    },
    set(value: any) {
      box_property(this, key, initializer && initializer());
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
