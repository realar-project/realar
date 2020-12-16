import React, { useRef, useReducer, useEffect, useMemo } from 'react';
import { expr, box, sel } from 'reactive-box';

const ssr_map = new Map();
const shareds = new Map();

let initial_data: any;

export {
  ssr_decorator as ssr,
  box_decorator as box,
  sel_decorator as sel,
  reaction,
  expression,
  shared,
  initial,
  observe,
  use,
  free,
};

function ssr_decorator(key: string) {
  return function (constructor: any) {
    ssr_map.set(constructor, key);
  };
}

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

function shared<M>(Class: new (init?: any) => M): M {
  let instance = shareds.get(Class);
  if (!instance) {
    if (ssr_map.has(Class)) {
      const key: string = ssr_map.get(Class);
      if (initial_data && initial_data.hasOwnProperty(key)) {
        instance = new Class(initial_data[key]);
      } else {
        instance = new Class();
      }
    } else {
      instance = new Class();
    }
    shareds.set(Class, instance);
  }
  return instance;
}

function useForceUpdate() {
  return useReducer(() => [], [])[1] as () => void;
}

function observe<T extends React.FC<P>, P>(Component: T) {
  return React.memo((props: P) => {
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
  // run destructors
  shareds.clear();
  initial_data = void 0;
}
