import { useRef, useReducer, useEffect, useMemo, FC } from 'react';
import { expr, box, sel, transaction } from 'reactive-box';

const shareds = new Map();

let initial_data: any;
let context_unsubs: any;
let shared_unsubs = [] as any;

export {
  prop,
  cache,
  action,
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
  transaction,

  Ensurable,
};

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
function on(
  target: any,
  listener: (value: any, prev?: any) => void
): () => void {
  let free: (() => void) | undefined;

  if (!target) return;
  else if ((target)[0]) {
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
  }, [Class, ...deps]);

  useEffect(h[1], [h]);
  return useValue(h[0]);
}

function useValue<T>(target: ((() => T) | { 0: () => T } | [() => T]), deps: any[] = []): T {
  const forceUpdate = useForceUpdate();
  const h = useMemo(() => {
    if ((target as any)[0]) target = (target as any)[0]; // box or selector or custom reactive

    if (typeof target === 'function') {
      const [run, stop] = expr(target as any, () => {
        forceUpdate();
        run();
      });
      run();
      return [target, () => stop, 1];
    } else {
      return [target as any, () => {}];
    }
  }, [target, ...deps]);

  useEffect(h[1], [h]);
  return h[2] ? h[0]() : h[0];
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
