import React, { Context, FC } from 'react';
import { expr, box, sel, transaction, untrack } from 'reactive-box';

export {
  value,
  selector,
  prop,
  cache,
  signal,
  on,
  sync,
  cycle,
  loop,
  effect,
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
  1: () => void;
  readonly val: T;
  get(): T;
} & [() => T, () => void];

type Value<T> = Callable<T> & {
  0: () => T;
  1: (value: T) => void;
  val: T;
  update: (fn: (state: T) => T) => void;
  get(): T;
  set(value: T): void;
} & [() => T, (value: T) => void];

type Signal<T, K = T> = Callable<T> &
  Pick<Promise<T>, 'then' | 'catch' | 'finally'> & {
    0: () => K;
    readonly val: K;
    get(): K;
  } & [() => K];

type Reactionable<T> = { 0: () => T } | [() => T] | (() => T);

function value<T = void>(): Value<T>;
function value<T = void>(init: T): Value<T>;
function value(init?: any): any {
  const [get, set] = box(init) as any;

  set[Symbol.iterator] = function* () {
    yield get;
    yield set;
  };
  set[0] = get;
  set[1] = set;
  set.get = get;
  set.set = set;

  set.update = (fn: any) => set(fn(get()));

  def_prop(set, key, { get, set });
  return set;
}

function selector<T>(body: () => T): Selector<T> {
  const h = sel(body) as any;
  const get = h[0];
  h.get = get;
  def_prop(h, key, { get });
  return h;
}

function signal<T = void>(): Signal<T, Ensurable<T>>;
function signal<T = void>(init: T): Signal<T>;
function signal<T = void, R = T>(init: R, transform: (data: T) => R): Signal<T, R>;
function signal(init?: any, transform?: any) {
  let resolve: any;
  const [get, set] = box([init]);

  const fn = function (data: any) {
    const ready = resolve;
    if (transform) data = transform(data);
    promisify();
    set([data]);
    ready(data);
  };
  const get_val = () => get()[0];

  fn[0] = get_val;
  fn[Symbol.iterator] = function* () {
    yield get_val;
  };
  fn.get = get_val;

  def_prop(fn, key, { get: get_val });

  promisify();

  function promisify() {
    const promise = new Promise(r => (resolve = r));
    ['then', 'catch', 'finally'].forEach(prop => {
      (fn as any)[prop] = (promise as any)[prop].bind(promise);
    });
  }

  return fn as any;
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

function loop(body: () => Promise<any>) {
  let running = 1;
  const fn = async () => {
    while (running) await body();
  }
  const unsub = () => {
    if (running) running = 0;
  };
  if (context_unsubs) context_unsubs.push(unsub);
  fn();
  return unsub;
}

type Pool<A extends any[], T> = {
  (...args: A): Promise<T>;
  count: number;
  threads: ThreadContext[];
  pending: boolean;
}
type ThreadContext = {
  stop(): void;
  active: boolean;
}

/*


pool(async () => {
  const stop = stoppable();

  if (stop.val) return;
  stop();
  // stop.abortController

});

*/


function pool<T, A extends any[]>(body: (context?: ThreadContext, ...args: A) => Promise<T>): Pool<A, T> {
  const [get_threads, set_threads] = box([]);
  const [get_count] = sel(() => get_threads().length);
  const [get_pending] = sel(() => get_count() > 0);

  function run() {
    const [get_active, set_active] = box(true);
    const stop = () => {
      if (get_active()) {
        const commit = transaction();
        set_active(false);
        set_threads(get_threads().filter((ctx) => ctx !== context));
        commit();
      }
    };
    const context = { stop };
    def_prop(context, 'active', { get: get_active });

    set_threads(get_threads().concat(context));
    let ret;
    try {
      ret = body.apply(this, [context as any].concat(arguments));
    } finally {
      if (ret && ret.finally) {
        ret.finally(stop);
      } else {
        stop();
      }
    };
    return ret;
  }

  def_prop(run, 'count', { get: get_count });
  def_prop(run, 'threads', { get: get_threads });
  def_prop(run, 'pending', { get: get_pending });

  return run as any;
}

function isolate() {
  const stack = context_unsubs;
  context_unsubs = [];
  return () => {
    const unsubs = context_unsubs;
    context_unsubs = stack;
    return () => {
      if (unsubs) call_array(unsubs);
    }
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
