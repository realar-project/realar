export {
  action,
  call,
  signal,
  unit,
  service,
  useUnit,
  useService,
  changed,
  ready,
  Service,
  Scope,
  mock,
  unmock
}

interface Function<A = [], R = void> {
  (...args: A): R;
}
type Action<P> = Function<P> & Promise<P>;
type Call<P, R> = Function<P, R>;
type Signal<P> = Function<P>;

declare function action<T extends []>(): Action<T>;
declare function call<T extends [], R = null>(): Call<T, R>;
declare function signal<T extends []>(): Signal<T>;

type UnitAsyncMethodsPending<T> = {
  [P in keyof T]: T[P] extends (...args: any[]) => Promise<any>
    ? T[P] & { pending: boolean }
    : T[P];
};
type UnitInstance<T> = Omit<UnitAsyncMethodsPending<T>, "constructor" | "destructor" | "expression">;

type UnitFactory<A, T> = (...args: A) => UnitInstance<T>;
type UnitClass<A, T> = new (...args: A) => UnitInstance<T>;
type UnitConstructorParameters<T> = Parameters<T["constructor"]>;
type Unit<T, A = UnitConstructorParameters<T>> = UnitFactory<A, T> & UnitClass<A, T>;

declare function unit<T extends {}>(schema: T): Unit<T>;
declare function service<T>(unit: Unit<T>): T;

declare function useUnit<T>(unit: Unit<T>, ...args: UnitConstructorParameters<T>): T;
declare function useService<T>(unit: Unit<T>): T;

declare function changed(value: any): boolean;

declare function ready<A = []>(callback: Function<A, unknown>, ...args: A): void;

declare function Service(props: { unit: Unit<any> }): null;
declare function Scope(props: { children: JSX.Element }): JSX.Element;

declare function mock(unit: Unit<any>): any;
declare function unmock(unit?: Unit<any>): any;
