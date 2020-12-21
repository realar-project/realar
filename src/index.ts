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

function reaction<T>(target: () => T, listener: (value: T) => void) {
  const [get] = sel(target);
  const [run, stop] = expr(get, () => {
    listener(run());
  });
  run();
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

function shared<M>(Class: new (init?: any) => M): M {
  let instance = shareds.get(Class);
  if (!instance) {
    shareds.set(Class, (instance = new Class(initial_data)));
  }
  return instance;
}

function useForceUpdate() {
  return useReducer(() => [], [])[1] as () => void;
}

function observe<T extends FC<P>, P>(Component: T) {
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

function use<T extends unknown[], M>(Class: new (...args: T) => M, deps?: T): M {
  return useMemo(() => (deps ? new Class(...deps) : new (Class as any)()), deps || []);
}

function free() {
  try {
    shareds.forEach(instance => {
      instance.destructor && instance.destructor();
    });
  } finally {
    shareds.clear();
    initial_data = void 0;
  }
}
