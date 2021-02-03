import React, { Context, FC } from 'react';
import { expr, box, sel, transaction } from 'reactive-box';

export {
  prop,
  cache,
  action,
  on,
  sync,
  cycle,
  effect,
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
  box,
  sel,
  expr,
  transaction,
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

const shareds = new Map();

let initial_data: any;
let context_unsubs: any;
let shared_unsubs = [] as any;
let is_sync: any;
let is_observe: any;
let scope_context: any;

type Ensurable<T> = T | void;

function action<T = undefined>(
  init?: T
): {
  (data: T): void;
  (): void;
  0: () => Ensurable<T>;
} {
  let resolve: (v: T) => void;
  const [get, set] = box([init]);

  const fn = function (data?: T) {
    const ready = resolve;
    promisify();
    set([data]);
    ready(data!);
  };

  fn[0] = (() => get()[0]) as () => Ensurable<T>;

  promisify();

  function promisify() {
    const promise = new Promise<T>(r => (resolve = r));
    ['then', 'catch', 'finally'].forEach(prop => {
      (fn as any)[prop] = (promise as any)[prop].bind(promise);
    });
  }

  return fn;
}

function on<T>(
  target: { 0: () => Ensurable<T> } | [() => Ensurable<T>] | (() => Ensurable<T>),
  listener: (value: T, prev?: T) => void
): () => void;
function on<T>(
  target: { 0: () => T } | [() => T] | (() => T),
  listener: (value: T, prev?: T) => void
): () => void;
function on(target: any, listener: (value: any, prev?: any) => void): () => void {
  const sync_mode = is_sync;
  let free: (() => void) | undefined;

  is_sync = 0;

  if (!target) return;
  else if (target[0]) {
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

function sync<T>(
  target: { 0: () => T } | [() => T] | (() => T),
  listener: (value: T, prev?: T) => void
): () => void {
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
    shared_unsubs.push(...h[1]);
    shareds.set(target, instance);
  }
  return instance;
}

function inst<M, K extends any[]>(
  target: (new (...args: K) => M) | ((...args: K) => M),
  args: K
): [M, (() => void)[]] {
  let instance;
  const stack = context_unsubs;
  context_unsubs = [];
  try {
    instance =
      typeof target.prototype === 'undefined'
        ? (target as any)(...args)
        : new (target as any)(...args);
  } finally {
    const unsubs = context_unsubs;
    context_unsubs = stack;
    return [instance, unsubs];
  }
}

function call_array(arr: (() => void)[]) {
  arr.forEach(fn => fn());
}

function get_scope_context(): Context<any> {
  return scope_context
    ? scope_context
    : (scope_context = (createContext as any)())
}

const useScoped = <M>(target: (new (init?: any) => M) | ((init?: any) => M)): M => {
  const context_data = useContext(get_scope_context());
  if (!context_data) {
    throw new Error('"Scope" parent component didn\'t find');
  }

  let instance;
  if (context_data[0].has(target)) {
    instance = context_data[0].get(target)
  } else  {
    const h = inst(target, [initial_data]);
    instance = h[0];
    context_data[1].push(...h[1]);

    context_data[0].set(target, instance);
  }
  return useValue(instance);
};

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
    return [i[0], () => () => call_array(i[1])] as any;
  }, deps);

  useEffect(h[1], [h]);
  return useValue(h[0], [h]);
}

function useValue<T>(target: (() => T) | { 0: () => T } | [() => T], deps: any[] = []): T {
  const forceUpdate = is_observe || useForceUpdate();
  const h = useMemo(() => {
    if (!target) return [target, () => {}]
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

function useShared<T>(target: () => (() => T) | { 0: () => T } | [() => T]): T {
  return useValue(shared(target));
}

function free() {
  try {
    call_array(shared_unsubs);
  } finally {
    shareds.clear();
    initial_data = void 0;
  }
}

function boxProperty(o: any, p: string | number | symbol, init?: any): any {
  const [get, set] = box(init);
  Object.defineProperty(o, p, { get, set });
}

function prop(_proto: any, key: any, descriptor?: any): any {
  const initializer = descriptor?.initializer;
  return {
    get() {
      boxProperty(this, key, initializer && initializer());
      return this[key];
    },
    set(value: any) {
      boxProperty(this, key, initializer && initializer());
      this[key] = value;
    },
  };
}

function cache(_proto: any, key: any, descriptor: any): any {
  return {
    get() {
      const [get] = sel(descriptor.get);
      Object.defineProperty(this, key, { get });
      return this[key];
    },
  };
}
