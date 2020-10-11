export {
  action,
  call,
  signal,
  unit,
  shared,
  useOwn,
  useShared,
  changed,
  pending,
  on,
  effect,
  ready,
  Shared,
  Scope,
  mock,
  unmock,

  AsyncPool,
  Argument,
  Result,
  Handler
}

type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
type Exclude<T, U> = T extends U ? never : T;
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

interface Func<A extends any[] = [], R = void> {
  (...args: A): R;
}
type Action<P extends any> = Func<[P]> & Promise<P> & number;
type Call<P extends any, R extends any> = Func<[P], R> & number;
type Signal<P extends any> = Func<[P]> & number;

declare function action<T extends any = void>(): Action<T>;
declare function call<T extends any = void, R extends any = void>(): Call<T, R>;
declare function signal<T extends any = void>(): Signal<T>;

type Argument<T> = T extends Action<infer P>
  ? P
  : T extends Call<infer P, any>
  ? P
  : T extends Signal<infer P>
  ? P
  : never
;
type Result<T> = T extends Call<any, infer R> ? R : never;
type Handler<T> = T extends Action<infer P>
  ? (arg: P) => void
  : T extends Call<infer P, infer R>
  ? (arg: P) => R
  : T extends Signal<infer P>
  ? (arg: P) => void
  : never
;

type AsyncPool = ((...args: any[]) => Promise<any>) & {
  pending: boolean
};

type UnitAsyncMethodsPending<T> = {
  [P in keyof T]: T[P] extends (...args: any[]) => Promise<any>
    ? T[P] & { pending: boolean; }
    : T[P];
};
type UnitInstance<T> = Omit<UnitAsyncMethodsPending<T>, "constructor" | "destructor" | "expression">;

type UnitFactory<A extends any[], T> = (...args: A) => UnitInstance<T>;
type UnitClass<A extends any[], T> = new (...args: A) => UnitInstance<T>;
type UnitConstructorParameters<T> = T extends { constructor: (...args: any[]) => any }
  ? Parameters<T["constructor"]>
  : [];

type Unit<T> = UnitFactory<UnitConstructorParameters<T>, T> & UnitClass<UnitConstructorParameters<T>, T>;

interface KeyedObject {
  [key: string]: unknown;
}
interface UnitSchemaInterface extends KeyedObject {
  constructor?: Function | ((...args: any[]) => void);
  destructor?: () => void;
  expression?: () => void;
}

declare function unit<T extends UnitSchemaInterface>(schema: T): Unit<T>;
declare function shared<T extends UnitSchemaInterface>(unit: Unit<T>): UnitInstance<T>;

declare function useOwn<T extends UnitSchemaInterface>(unit: Unit<T>, ...args: UnitConstructorParameters<T>): UnitInstance<T>;
declare function useShared<T extends UnitSchemaInterface>(unit: Unit<T>): UnitInstance<T>;

declare function changed(value: any): boolean;
declare function pending(async: Func<any, Promise<any>>): boolean;

declare function on<P extends any>(target: Action<P>, fn: Func<[P]>): void;
declare function on<P extends any, R extends any>(target: Call<P, R>, fn: Func<[P], R>): void;
declare function on<P extends any>(target: Signal<P>, fn: Func<[P]>): void;

declare function effect(fn: () => () => void): void;
declare function effect(fn: () => void): void;

declare function ready<A extends any[] = []>(fn: Func<A, any>, ...args: A): void;

type UnitShared = Unit<{
  constructor?: () => void;
}>;

declare function Shared<T extends UnitShared>(props: { unit: T }): null;
declare function Scope(props: { children: JSX.Element | JSX.Element[] }): JSX.Element;

declare function mock(unit: Unit<any>): any;
declare function unmock(unit?: Unit<any>): any;



