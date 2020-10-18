export {
  unit,
  shared,
  useOwn,
  useShared,
  changed,
  pending,
  effect,
  Shared,
  mock,
  unmock,
  AsyncPool,
}

type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
type Exclude<T, U> = T extends U ? never : T;
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

interface Func<A extends any[] = [], R = void> {
  (...args: A): R;
}

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

declare function effect(fn: () => () => void): void;
declare function effect(fn: () => void): void;

type UnitShared = Unit<{
  constructor?: () => void;
}>;

declare function Shared<T extends UnitShared>(props: { unit: T }): null;

declare function mock(unit: Unit<any>): any;
declare function unmock(unit?: Unit<any>): any;



