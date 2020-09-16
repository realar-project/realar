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

interface Func<A extends any[] = [], R = void> {
  (...args: A): R;
}
type Action<P extends any[]> = Func<P> & Promise<P> & symbol;
type Call<P extends any[], R> = Func<P, R> & symbol;
type Signal<P extends any[]> = Func<P> & symbol;

declare function action<T extends any[] = []>(): Action<T>;
declare function call<T extends any[] = [], R = void>(): Call<T, R>;
declare function signal<T extends any[] = []>(): Signal<T>;

type UnitAsyncMethodsPending<T> = {
  [P in keyof T]: T[P] extends (...args: any[]) => Promise<any>
    ? T[P] & { pending: boolean }
    : T[P];
};
type UnitInstance<T> = Omit<UnitAsyncMethodsPending<T>, "constructor" | "destructor" | "expression">;

type UnitFactory<A extends any[], T> = (...args: A) => UnitInstance<T>;
type UnitClass<A extends any[], T> = new (...args: A) => UnitInstance<T>;
type UnitConstructorParameters<T> = T extends { constructor: (...args: any[]) => any }
  ? Parameters<T["constructor"]>
  : [];

type Unit<T> = UnitFactory<UnitConstructorParameters<T>, T> & UnitClass<UnitConstructorParameters<T>, T>;

interface UnitSchemaInterface {
  [key: string]: any,
  constructor?: ((...args: any[]) => void) | Function,
  destructor?: () => void,
  expression?: () => void
}

declare function unit<T extends UnitSchemaInterface>(schema: T): Unit<T>;
declare function service<T>(unit: Unit<T>): T;

declare function useUnit<T>(unit: Unit<T>, ...args: UnitConstructorParameters<T>): T;
declare function useService<T>(unit: Unit<T>): T;

declare function changed(value: any): boolean;

declare function ready<A extends any[] = []>(callback: Func<A, any>, ...args: A): void;

declare function Service(props: { unit: Unit<any> }): null;
declare function Scope(props: { children: JSX.Element }): JSX.Element;

declare function mock(unit: Unit<any>): any;
declare function unmock(unit?: Unit<any>): any;
