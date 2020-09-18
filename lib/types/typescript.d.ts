export {
  action,
  call,
  signal,
  unit,
  service,
  useUnit,
  useService,
  changed,
  pending,
  ready,
  Service,
  Scope,
  mock,
  unmock
}

type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
type Exclude<T, U> = T extends U ? never : T;
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

interface Func<A extends any[] = [], R = void> {
  (...args: A): R;
}
type Action<P extends any[]> = Func<P> & Promise<P> & number;
type Call<P extends any[], R> = Func<P, R> & number;
type Signal<P extends any[]> = Func<P> & number;

declare function action<T extends any[] = []>(): Action<T>;
declare function call<T extends any[] = [], R = void>(): Call<T, R>;
declare function signal<T extends any[] = []>(): Signal<T>;

type UnitInstance<T> = Omit<T, "constructor" | "destructor" | "expression">;

type UnitFactory<A extends any[], T> = (...args: A) => UnitInstance<T>;
type UnitClass<A extends any[], T> = new (...args: A) => UnitInstance<T>;
type UnitConstructorParameters<T> = T extends { constructor: (...args: any[]) => any }
  ? Parameters<T["constructor"]>
  : [];

type Unit<T> = UnitFactory<UnitConstructorParameters<T>, T> & UnitClass<UnitConstructorParameters<T>, T>;

interface UnitSchemaInterface {
  constructor?: (...args: any[]) => void;
  destructor?: () => void;
  expression?: () => void;
}

declare function unit<T extends UnitSchemaInterface>(schema: T): Unit<T>;
declare function service<T extends UnitSchemaInterface>(unit: Unit<T>): UnitInstance<T>;

declare function useUnit<T extends UnitSchemaInterface>(unit: Unit<T>, ...args: UnitConstructorParameters<T>): UnitInstance<T>;
declare function useService<T extends UnitSchemaInterface>(unit: Unit<T>): UnitInstance<T>;

declare function changed(value: any): boolean;
declare function pending(async: Func<any, Promise<any>>): boolean;

declare function ready<A extends any[] = []>(callback: Func<A, any>, ...args: A): void;

type UnitService = Unit<{
  constructor?: () => void;
}>;

declare function Service<T extends UnitService>(props: { unit: T }): null;
declare function Scope(props: { children: JSX.Element }): JSX.Element;

declare function mock(unit: Unit<any>): any;
declare function unmock(unit?: Unit<any>): any;



