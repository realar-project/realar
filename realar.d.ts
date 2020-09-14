interface Function<A = [], R = void> {
  (...args: A): R;
}
type Action<P> = Function<P> & Promise<P>;
type Call<P, R> = Function<P, R>;
type Shared<P> = Function<P>;

declare function action<T extends []>(): Action<T>;
declare function call<T extends [], R = null>(): Call<T, R>;
declare function shared<T extends []>(): Shared<T>; // Which task It resolved?

type UnitInstance<T> = Omit<T, "constructor" | "destructor" | "expression">;
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

declare function Service(): void;
declare function Scope(): void;

declare function mock(): void;
declare function unmock(): void;
