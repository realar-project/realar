import { useRef, useReducer, useEffect, useMemo, FC } from 'react';
import { expr, box, sel, transaction } from 'reactive-box';

const shareds = new Map();

let initial_data: any;
let context_unsubs: any;
let shared_unsubs = [] as any;

export {
  action,
  prop,
  cache,
  on,
  cycle,
  effect,
  shared,
  initial,
  observe,
  useValue,
  useLocal,
  useShared,
  free,
  mock,
  box,
  sel,
  expr,
  transaction
};

function action<T = void>(): {
  (data?: T): void;
  (): void;
  0: () => [void | T, boolean];
} {
  let resolve: (v: T) => void;
  const [getInfo, setInfo] = box([void 0, false] as [T | void, boolean]);

  const fn = function (data?: T) {
    const ready = resolve;
    promisify();
    setInfo([data, true]);
    ready(data!);
  };

  fn[0] = getInfo;

  promisify();

  function promisify() {
    const promise = new Promise<T>(r => (resolve = r));
    ['then', 'catch', 'finally'].forEach(prop => {
      (fn as any)[prop] = (promise as any)[prop].bind(promise);
    });
  }

  return fn;
}

function boxProperty(target: any, key: any, initializer: any) {
  const [get, set] = box(initializer && initializer());
  Object.defineProperty(target, key, { get, set });
}

function prop(_proto: any, key: any, descriptor?: any): any {
  return {
    get() {
      boxProperty(this, key, descriptor?.initializer);
      return this[key];
    },
    set(value: any) {
      boxProperty(this, key, descriptor?.initializer);
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

function on<T>(
  target: () => T | { 0: () => T } | [() => T],
  listener: (value: T, prev?: T) => void
) {
  if (!target) return;
  else if ((target as any)[0]) target = (target as any)[0]; // box or selector or custom reactive

  let value: T;
  const [get, free] = sel(target);
  const [run, stop] = expr(get, () => {
    const prev = value;
    listener((value = run() as any), prev);
  });
  value = run() as any;
  const unsub = () => (free(), stop());
  if (context_unsubs) context_unsubs.push(unsub);
  return unsub;
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

function mock<M>(Class: (new (init?: any) => M) | ((init?: any) => M), mocked: M): M {
  shareds.set(Class, mocked);
  return mocked;
}

function shared<M>(Class: (new (init?: any) => M) | ((init?: any) => M)): M {
  let instance = shareds.get(Class);
  if (!instance) {
    const stack = context_unsubs;
    context_unsubs = [];
    try {
      instance =
        typeof Class.prototype === 'undefined'
          ? (Class as (init?: any) => M)(initial_data)
          : new (Class as new (init?: any) => M)(initial_data);
    } finally {
      shared_unsubs.push(...context_unsubs);
      context_unsubs = stack;
    }

    shareds.set(Class, instance);
  }
  return instance;
}

function useForceUpdate() {
  return useReducer(() => [], [])[1] as () => void;
}

function observe<T extends FC>(FunctionComponent: T): T {
  return function () {
    const forceUpdate = useForceUpdate();
    const ref = useRef<[T, () => void]>();
    if (!ref.current) ref.current = expr(FunctionComponent, forceUpdate);
    useEffect(() => ref.current![1], []);
    return ref.current[0].apply(this, arguments);
  } as any;
}

function useLocal<T extends unknown[], M>(
  Class: (new (...args: T) => M) | ((...args: T) => M),
  deps = [] as T
): M {
  if (!Array.isArray(deps)) {
    throw new Error('TypeError: deps argument should be an array in "use" call');
  }
  const h = useMemo(() => {
    let inst, unsubs: (() => void)[];
    const stack = context_unsubs;
    context_unsubs = [];
    try {
      inst =
        typeof Class.prototype === 'undefined'
          ? (Class as any)(...(deps as any))
          : (new (Class as any)(...(deps as any)) as any);
    } finally {
      unsubs = context_unsubs;
      context_unsubs = stack;
    }
    return [inst, () => () => unsubs.forEach(fn => fn())];
  }, deps);

  useEffect(h[1], deps);
  return h[0];
}

function useValue<T>(target: (() => T) | { 0: () => T } | [() => T]): T {
  const forceUpdate = useForceUpdate();
  const ref = useRef<[() => void, any, any?]>();
  if (!ref.current) {
    if ((target as any)[0]) target = (target as any)[0]; // box or selector or custom reactive

    if (typeof target === 'function') {
      const [run, stop] = expr(target as any, () => {
        forceUpdate();
        run();
      });
      run();
      ref.current = [stop, target];
    } else {
      ref.current = [void 0, target];
    }
  }
  const cur = ref.current;
  useEffect(() => cur[0], []);
  return cur[0] ? cur[1]() : cur[1];
}

function useShared<T>(target: () => (() => T) | { 0: () => T } | [() => T]): T {
  return useValue(shared(target));
}

function free() {
  try {
    shared_unsubs.forEach((fn: () => void) => fn());
  } finally {
    shareds.clear();
    initial_data = void 0;
  }
}
