import { useRef, useReducer, useEffect, useMemo, FC, memo } from 'react';
import { expr, box, sel } from 'reactive-box';

const shareds = new Map();

let initial_data: any;

export {
  box_decorator as box,
  sel_decorator as sel,
  reaction,
  expression,
  shared,
  initial,
  observe,
  use,
  free,
  mock,
};

function box_decorator(_proto: any, key: any, descriptor?: any): any {
  const { initializer } = descriptor || {};
  const applyProperty = (target: any) => {
    const [get, set] = box(initializer && initializer());
    Object.defineProperty(target, key, { get, set });
  };
  return {
    get() {
      applyProperty(this);
      return this[key];
    },
    set(value: any) {
      applyProperty(this);
      this[key] = value;
    },
  };
}

function sel_decorator(_proto: any, key: any, descriptor: any): any {
  return {
    get() {
      const [get] = sel(descriptor.get);
      Object.defineProperty(this, key, { get });
      return this[key];
    },
  };
}

function reaction<T>(target: () => T, listener: (value: T, prev?: T) => void) {
  let value: T;
  const [get] = sel(target);
  const [run, stop] = expr(get, () => {
    const prev = value;
    listener((value = run()), prev);
  });
  value = run();
  return stop;
}

function expression(body: () => void) {
  const [run, stop] = expr(body);
  run();
  return stop;
}

function initial(data: any): void {
  initial_data = data;
}

function mock<M>(Class: new (init?: any) => M, mocked: M): M {
  shareds.set(Class, mocked);
  return mocked;
}

function shared<M>(Class: (new (init?: any) => M) | ((init?: any) => M)): M {
  let instance = shareds.get(Class);
  if (!instance) {
    instance =
      typeof Class.prototype === 'undefined'
        ? (Class as (init?: any) => M)(initial_data)
        : new (Class as new (init?: any) => M)(initial_data);
    shareds.set(Class, instance);
  }
  return instance;
}

function useForceUpdate() {
  return useReducer(() => [], [])[1] as () => void;
}

function observe<T extends FC<P>, P>(Component: T) {
  // Todo: check forwardRef support
  return memo((props: P) => {
    const forceUpdate = useForceUpdate();
    const ref = useRef<[T, () => void]>();
    if (!ref.current) {
      const [Observed, free] = expr(Component, forceUpdate);
      ref.current = [Observed, free];
    }
    useEffect(() => ref.current![1], []);
    return ref.current[0](props);
  });
}

function use<T extends unknown[], M>(Class: new (...args: T) => M, deps = [] as T): M {
  if (!Array.isArray(deps)) {
    throw 'TypeError: deps argument should be an array';
  }
  return useMemo(() => (
    new Class(...(deps as any)) as any
  ), deps);
}

function free() {
  try {
    shareds.forEach(instance => (
      instance.destructor && instance.destructor()
    ));
  } finally {
    shareds.clear();
    initial_data = void 0;
  }
}
