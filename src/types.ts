import { FC } from 'react';

//
// Exports
//

export {
  Value,
  ValueReadonly,
  Signal,
  SignalReadonly,
  Will,

  ValueEntry,
  SignalEntry,

  Local,
  Contextual,

  Observe,
  UseScoped,
  UseLocal,
  UseValue,
  UseValues,
  UseJsx,

  On,
  Sync,

  Transaction,
  Untrack,
  Isolate,

  PoolEntry,
}


//
// Typings.
//

// @see https://github.com/Microsoft/TypeScript/issues/27024
type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2)
  ? ([X] extends [Y]
    ? ([Y] extends [X] ? true : false) : false)
  : false;

type Re<T> = { get: () => T } | (() => T);
type ReWrit<T> = { set: (value: T) => void } | ((value: T) => void);

type Re_Exemplar = Re<any>;
type Re_CfgExemplar = {
  [key: string]: Re<any>
}

type Will<T> = T | undefined;
type WillExpand<T> = [T] extends [Will<unknown>] ? ((p: T) => 0) extends (p: Will<infer P>) => 0 ? P | undefined : T : T;
type WillExtract<T> = [T] extends [Will<unknown>] ? ((p: T) => 0) extends (p: Will<infer P>) => 0 ? P : T : T;
type WillEnsure<T> = [T] extends [Will<unknown>] ? ((p: T) => 0) extends (p: Will<infer P>) => 0 ?  Will<P> : Will<T> : Will<T>;
type WillIf<T, R> = [T] extends [Will<unknown>] ? ((p: T) => 0) extends (p: Will<infer P>) => 0 ? WillEnsure<R> : R : R;

//
// Realar external api typings
//

type On = {
  <T>(target: Re<Will<T>>, fn: (value: T, prev: WillExpand<Will<T>>) => void): void
  <T>(target: Re<T>, fn: (value: T, prev: T) => void): void
}
type Sync = {
  <T>(target: Re<Will<T>>, fn: (value: T, prev: WillExpand<Will<T>>) => void): void
  <T>(target: Re<T>, fn: (value: T, prev: T) => void): void
}

type Local = {
  inject(fn: () => void): void;
}
type Contextual = {
  stop: () => void;
}
type Isolate = {
  (fn): () => void;
  unsafe: () => () => () => void;
}
type Transaction = {
  <T>(fn: () => T): T;
  unsafe: () => () => void;
  func: <T extends (...args: any[]) => any>(fn: T) => T;
}
type Untrack = {
  <T>(fn: () => T): T;
  unsafe: () => () => void;
  func: <T extends (...args: any[]) => any>(fn: T) => T;
}

//
// Entity types
//

type E_SetPartial<T> = Equals<T, void> extends true
  ? { (): void; set(): void }
  : { (value: T): void; set(value: T): void }
type E_ValReadonlyPartial<O> = { readonly val: O }
type E_ValPartial<I, O> = Equals<I, O> extends true ? { val: O } : E_ValReadonlyPartial<O>

interface E_PromisePartial<O> {
  promise: Promise<WillExtract<O>>
}
interface E_GetPartial<O> {
  get: () => O;
}
interface E_SyncToPartial<O, Ret> {
  sync(func: (value: WillExtract<O>, prev: WillExpand<O>) => void): Ret
  to: {
    (func: (value: WillExtract<O>, prev: WillExpand<O>) => void): Ret
    once(func: (value: WillExtract<O>, prev: WillExpand<O>) => void): Ret
  }
}
interface E_OpPartial<Ret> {
  op<R>(func: () => R): R extends void ? Ret : R
}

type E_SelectMultiple_CfgExemplar<O> = {
  [key: string]: (state: O) => void
}
type _S<O,T> = ((state: O) => T) | (() => T);

interface E_SelectMultiple_Func<o> {
  <A>(targets: [_S<o,A>]): [ValueReadonly<A>];
  <A,B>(targets: [_S<o,A>,_S<o,B>]): [ValueReadonly<A>,ValueReadonly<B>];
  <A,B,C>(targets: [_S<o,A>,_S<o,B>,_S<o,C>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>];
  <A,B,C,D>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>];
  <A,B,C,D,E>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>];
  <A,B,C,D,E,F>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>];
  <A,B,C,D,E,F,G>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>];
  <A,B,C,D,E,F,G,H>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>,ValueReadonly<H>];
  <A,B,C,D,E,F,G,H,I>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>,ValueReadonly<H>,ValueReadonly<I>];
  <A,B,C,D,E,F,G,H,I,J>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>,ValueReadonly<H>,ValueReadonly<I>,ValueReadonly<J>];
  <A,B,C,D,E,F,G,H,I,J,K>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>,ValueReadonly<H>,ValueReadonly<I>,ValueReadonly<J>,ValueReadonly<K>];
  <A,B,C,D,E,F,G,H,I,J,K,L>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>,ValueReadonly<H>,ValueReadonly<I>,ValueReadonly<J>,ValueReadonly<K>,ValueReadonly<L>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>,ValueReadonly<H>,ValueReadonly<I>,ValueReadonly<J>,ValueReadonly<K>,ValueReadonly<L>,ValueReadonly<M>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>,ValueReadonly<H>,ValueReadonly<I>,ValueReadonly<J>,ValueReadonly<K>,ValueReadonly<L>,ValueReadonly<M>,ValueReadonly<N>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>,ValueReadonly<H>,ValueReadonly<I>,ValueReadonly<J>,ValueReadonly<K>,ValueReadonly<L>,ValueReadonly<M>,ValueReadonly<N>,ValueReadonly<O>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>,ValueReadonly<H>,ValueReadonly<I>,ValueReadonly<J>,ValueReadonly<K>,ValueReadonly<L>,ValueReadonly<M>,ValueReadonly<N>,ValueReadonly<O>,ValueReadonly<P>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>,ValueReadonly<H>,ValueReadonly<I>,ValueReadonly<J>,ValueReadonly<K>,ValueReadonly<L>,ValueReadonly<M>,ValueReadonly<N>,ValueReadonly<O>,ValueReadonly<P>,ValueReadonly<Q>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>,ValueReadonly<H>,ValueReadonly<I>,ValueReadonly<J>,ValueReadonly<K>,ValueReadonly<L>,ValueReadonly<M>,ValueReadonly<N>,ValueReadonly<O>,ValueReadonly<P>,ValueReadonly<Q>,ValueReadonly<R>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>,_S<o,S>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>,ValueReadonly<H>,ValueReadonly<I>,ValueReadonly<J>,ValueReadonly<K>,ValueReadonly<L>,ValueReadonly<M>,ValueReadonly<N>,ValueReadonly<O>,ValueReadonly<P>,ValueReadonly<Q>,ValueReadonly<R>,ValueReadonly<S>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>,_S<o,S>,_S<o,T>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>,ValueReadonly<H>,ValueReadonly<I>,ValueReadonly<J>,ValueReadonly<K>,ValueReadonly<L>,ValueReadonly<M>,ValueReadonly<N>,ValueReadonly<O>,ValueReadonly<P>,ValueReadonly<Q>,ValueReadonly<R>,ValueReadonly<S>,ValueReadonly<T>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>,_S<o,S>,_S<o,T>,_S<o,U>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>,ValueReadonly<H>,ValueReadonly<I>,ValueReadonly<J>,ValueReadonly<K>,ValueReadonly<L>,ValueReadonly<M>,ValueReadonly<N>,ValueReadonly<O>,ValueReadonly<P>,ValueReadonly<Q>,ValueReadonly<R>,ValueReadonly<S>,ValueReadonly<T>,ValueReadonly<U>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>,_S<o,S>,_S<o,T>,_S<o,U>,_S<o,V>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>,ValueReadonly<H>,ValueReadonly<I>,ValueReadonly<J>,ValueReadonly<K>,ValueReadonly<L>,ValueReadonly<M>,ValueReadonly<N>,ValueReadonly<O>,ValueReadonly<P>,ValueReadonly<Q>,ValueReadonly<R>,ValueReadonly<S>,ValueReadonly<T>,ValueReadonly<U>,ValueReadonly<V>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>,_S<o,S>,_S<o,T>,_S<o,U>,_S<o,V>,_S<o,W>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>,ValueReadonly<H>,ValueReadonly<I>,ValueReadonly<J>,ValueReadonly<K>,ValueReadonly<L>,ValueReadonly<M>,ValueReadonly<N>,ValueReadonly<O>,ValueReadonly<P>,ValueReadonly<Q>,ValueReadonly<R>,ValueReadonly<S>,ValueReadonly<T>,ValueReadonly<U>,ValueReadonly<V>,ValueReadonly<W>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>,_S<o,S>,_S<o,T>,_S<o,U>,_S<o,V>,_S<o,W>,_S<o,X>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>,ValueReadonly<H>,ValueReadonly<I>,ValueReadonly<J>,ValueReadonly<K>,ValueReadonly<L>,ValueReadonly<M>,ValueReadonly<N>,ValueReadonly<O>,ValueReadonly<P>,ValueReadonly<Q>,ValueReadonly<R>,ValueReadonly<S>,ValueReadonly<T>,ValueReadonly<U>,ValueReadonly<V>,ValueReadonly<W>,ValueReadonly<X>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>,_S<o,S>,_S<o,T>,_S<o,U>,_S<o,V>,_S<o,W>,_S<o,X>,_S<o,Y>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>,ValueReadonly<H>,ValueReadonly<I>,ValueReadonly<J>,ValueReadonly<K>,ValueReadonly<L>,ValueReadonly<M>,ValueReadonly<N>,ValueReadonly<O>,ValueReadonly<P>,ValueReadonly<Q>,ValueReadonly<R>,ValueReadonly<S>,ValueReadonly<T>,ValueReadonly<U>,ValueReadonly<V>,ValueReadonly<W>,ValueReadonly<X>,ValueReadonly<Y>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>,_S<o,S>,_S<o,T>,_S<o,U>,_S<o,V>,_S<o,W>,_S<o,X>,_S<o,Y>,_S<o,Z>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>,ValueReadonly<H>,ValueReadonly<I>,ValueReadonly<J>,ValueReadonly<K>,ValueReadonly<L>,ValueReadonly<M>,ValueReadonly<N>,ValueReadonly<O>,ValueReadonly<P>,ValueReadonly<Q>,ValueReadonly<R>,ValueReadonly<S>,ValueReadonly<T>,ValueReadonly<U>,ValueReadonly<V>,ValueReadonly<W>,ValueReadonly<X>,ValueReadonly<Y>,ValueReadonly<Z>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>,_S<o,S>,_S<o,T>,_S<o,U>,_S<o,V>,_S<o,W>,_S<o,X>,_S<o,Y>,_S<o,Z>,_S<o,$>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>,ValueReadonly<H>,ValueReadonly<I>,ValueReadonly<J>,ValueReadonly<K>,ValueReadonly<L>,ValueReadonly<M>,ValueReadonly<N>,ValueReadonly<O>,ValueReadonly<P>,ValueReadonly<Q>,ValueReadonly<R>,ValueReadonly<S>,ValueReadonly<T>,ValueReadonly<U>,ValueReadonly<V>,ValueReadonly<W>,ValueReadonly<X>,ValueReadonly<Y>,ValueReadonly<Z>,ValueReadonly<$>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,_>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>,_S<o,S>,_S<o,T>,_S<o,U>,_S<o,V>,_S<o,W>,_S<o,X>,_S<o,Y>,_S<o,Z>,_S<o,$>,_S<o,_>]): [ValueReadonly<A>,ValueReadonly<B>,ValueReadonly<C>,ValueReadonly<D>,ValueReadonly<E>,ValueReadonly<F>,ValueReadonly<G>,ValueReadonly<H>,ValueReadonly<I>,ValueReadonly<J>,ValueReadonly<K>,ValueReadonly<L>,ValueReadonly<M>,ValueReadonly<N>,ValueReadonly<O>,ValueReadonly<P>,ValueReadonly<Q>,ValueReadonly<R>,ValueReadonly<S>,ValueReadonly<T>,ValueReadonly<U>,ValueReadonly<V>,ValueReadonly<W>,ValueReadonly<X>,ValueReadonly<Y>,ValueReadonly<Z>,ValueReadonly<$>,ValueReadonly<_>];

  <T extends E_SelectMultiple_CfgExemplar<o>>(targets: T): {
    [P in keyof T]: T[P] extends ((state: o) => infer U) ? ValueReadonly<U> : never
  }
}

interface E_SelectPartial<O> {
  select: {
    <R>(func?: (value: O) => R): ValueReadonly<R>        // tracked by default
    untrack<R>(func?: (value: O) => R): ValueReadonly<R>
    multiple: E_SelectMultiple_Func<O> & {
      untrack: E_SelectMultiple_Func<O>
    }
  }
}

type E_UpdaterMultiple_CfgExemplar<I, O> = {
  [key: string]: (state: O, upValue: never, upPrev: never) => I
}
type _US<T> = Equals<T, unknown> extends true ? Signal : Signal<T, Will<T>>
type _U<I,O,U> = ((state: O, upValue: U, upPrev: U) => I) | (() => I);

interface E_UpdaterMultiplePartial<i, o> {
  multiple: {
    <A>(targets: [_U<i,o,A>]): [_US<A>];
    <A,B>(targets: [_U<i,o,A>,_U<i,o,B>]): [_US<A>,_US<B>];
    <A,B,C>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>]): [_US<A>,_US<B>,_US<C>];
    <A,B,C,D>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>]): [_US<A>,_US<B>,_US<C>,_US<D>];
    <A,B,C,D,E>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>];
    <A,B,C,D,E,F>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>];
    <A,B,C,D,E,F,G>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>];
    <A,B,C,D,E,F,G,H>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>,_U<i,o,H>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>,_US<H>];
    <A,B,C,D,E,F,G,H,I>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>,_U<i,o,H>,_U<i,o,I>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>,_US<H>,_US<I>];
    <A,B,C,D,E,F,G,H,I,J>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>,_U<i,o,H>,_U<i,o,I>,_U<i,o,J>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>,_US<H>,_US<I>,_US<J>];
    <A,B,C,D,E,F,G,H,I,J,K>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>,_U<i,o,H>,_U<i,o,I>,_U<i,o,J>,_U<i,o,K>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>,_US<H>,_US<I>,_US<J>,_US<K>];
    <A,B,C,D,E,F,G,H,I,J,K,L>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>,_U<i,o,H>,_U<i,o,I>,_U<i,o,J>,_U<i,o,K>,_U<i,o,L>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>,_US<H>,_US<I>,_US<J>,_US<K>,_US<L>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>,_U<i,o,H>,_U<i,o,I>,_U<i,o,J>,_U<i,o,K>,_U<i,o,L>,_U<i,o,M>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>,_US<H>,_US<I>,_US<J>,_US<K>,_US<L>,_US<M>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>,_U<i,o,H>,_U<i,o,I>,_U<i,o,J>,_U<i,o,K>,_U<i,o,L>,_U<i,o,M>,_U<i,o,N>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>,_US<H>,_US<I>,_US<J>,_US<K>,_US<L>,_US<M>,_US<N>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>,_U<i,o,H>,_U<i,o,I>,_U<i,o,J>,_U<i,o,K>,_U<i,o,L>,_U<i,o,M>,_U<i,o,N>,_U<i,o,O>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>,_US<H>,_US<I>,_US<J>,_US<K>,_US<L>,_US<M>,_US<N>,_US<O>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>,_U<i,o,H>,_U<i,o,I>,_U<i,o,J>,_U<i,o,K>,_U<i,o,L>,_U<i,o,M>,_U<i,o,N>,_U<i,o,O>,_U<i,o,P>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>,_US<H>,_US<I>,_US<J>,_US<K>,_US<L>,_US<M>,_US<N>,_US<O>,_US<P>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>,_U<i,o,H>,_U<i,o,I>,_U<i,o,J>,_U<i,o,K>,_U<i,o,L>,_U<i,o,M>,_U<i,o,N>,_U<i,o,O>,_U<i,o,P>,_U<i,o,Q>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>,_US<H>,_US<I>,_US<J>,_US<K>,_US<L>,_US<M>,_US<N>,_US<O>,_US<P>,_US<Q>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>,_U<i,o,H>,_U<i,o,I>,_U<i,o,J>,_U<i,o,K>,_U<i,o,L>,_U<i,o,M>,_U<i,o,N>,_U<i,o,O>,_U<i,o,P>,_U<i,o,Q>,_U<i,o,R>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>,_US<H>,_US<I>,_US<J>,_US<K>,_US<L>,_US<M>,_US<N>,_US<O>,_US<P>,_US<Q>,_US<R>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>,_U<i,o,H>,_U<i,o,I>,_U<i,o,J>,_U<i,o,K>,_U<i,o,L>,_U<i,o,M>,_U<i,o,N>,_U<i,o,O>,_U<i,o,P>,_U<i,o,Q>,_U<i,o,R>,_U<i,o,S>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>,_US<H>,_US<I>,_US<J>,_US<K>,_US<L>,_US<M>,_US<N>,_US<O>,_US<P>,_US<Q>,_US<R>,_US<S>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>,_U<i,o,H>,_U<i,o,I>,_U<i,o,J>,_U<i,o,K>,_U<i,o,L>,_U<i,o,M>,_U<i,o,N>,_U<i,o,O>,_U<i,o,P>,_U<i,o,Q>,_U<i,o,R>,_U<i,o,S>,_U<i,o,T>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>,_US<H>,_US<I>,_US<J>,_US<K>,_US<L>,_US<M>,_US<N>,_US<O>,_US<P>,_US<Q>,_US<R>,_US<S>,_US<T>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>,_U<i,o,H>,_U<i,o,I>,_U<i,o,J>,_U<i,o,K>,_U<i,o,L>,_U<i,o,M>,_U<i,o,N>,_U<i,o,O>,_U<i,o,P>,_U<i,o,Q>,_U<i,o,R>,_U<i,o,S>,_U<i,o,T>,_U<i,o,U>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>,_US<H>,_US<I>,_US<J>,_US<K>,_US<L>,_US<M>,_US<N>,_US<O>,_US<P>,_US<Q>,_US<R>,_US<S>,_US<T>,_US<U>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>,_U<i,o,H>,_U<i,o,I>,_U<i,o,J>,_U<i,o,K>,_U<i,o,L>,_U<i,o,M>,_U<i,o,N>,_U<i,o,O>,_U<i,o,P>,_U<i,o,Q>,_U<i,o,R>,_U<i,o,S>,_U<i,o,T>,_U<i,o,U>,_U<i,o,V>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>,_US<H>,_US<I>,_US<J>,_US<K>,_US<L>,_US<M>,_US<N>,_US<O>,_US<P>,_US<Q>,_US<R>,_US<S>,_US<T>,_US<U>,_US<V>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>,_U<i,o,H>,_U<i,o,I>,_U<i,o,J>,_U<i,o,K>,_U<i,o,L>,_U<i,o,M>,_U<i,o,N>,_U<i,o,O>,_U<i,o,P>,_U<i,o,Q>,_U<i,o,R>,_U<i,o,S>,_U<i,o,T>,_U<i,o,U>,_U<i,o,V>,_U<i,o,W>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>,_US<H>,_US<I>,_US<J>,_US<K>,_US<L>,_US<M>,_US<N>,_US<O>,_US<P>,_US<Q>,_US<R>,_US<S>,_US<T>,_US<U>,_US<V>,_US<W>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>,_U<i,o,H>,_U<i,o,I>,_U<i,o,J>,_U<i,o,K>,_U<i,o,L>,_U<i,o,M>,_U<i,o,N>,_U<i,o,O>,_U<i,o,P>,_U<i,o,Q>,_U<i,o,R>,_U<i,o,S>,_U<i,o,T>,_U<i,o,U>,_U<i,o,V>,_U<i,o,W>,_U<i,o,X>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>,_US<H>,_US<I>,_US<J>,_US<K>,_US<L>,_US<M>,_US<N>,_US<O>,_US<P>,_US<Q>,_US<R>,_US<S>,_US<T>,_US<U>,_US<V>,_US<W>,_US<X>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>,_U<i,o,H>,_U<i,o,I>,_U<i,o,J>,_U<i,o,K>,_U<i,o,L>,_U<i,o,M>,_U<i,o,N>,_U<i,o,O>,_U<i,o,P>,_U<i,o,Q>,_U<i,o,R>,_U<i,o,S>,_U<i,o,T>,_U<i,o,U>,_U<i,o,V>,_U<i,o,W>,_U<i,o,X>,_U<i,o,Y>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>,_US<H>,_US<I>,_US<J>,_US<K>,_US<L>,_US<M>,_US<N>,_US<O>,_US<P>,_US<Q>,_US<R>,_US<S>,_US<T>,_US<U>,_US<V>,_US<W>,_US<X>,_US<Y>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>,_U<i,o,H>,_U<i,o,I>,_U<i,o,J>,_U<i,o,K>,_U<i,o,L>,_U<i,o,M>,_U<i,o,N>,_U<i,o,O>,_U<i,o,P>,_U<i,o,Q>,_U<i,o,R>,_U<i,o,S>,_U<i,o,T>,_U<i,o,U>,_U<i,o,V>,_U<i,o,W>,_U<i,o,X>,_U<i,o,Y>,_U<i,o,Z>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>,_US<H>,_US<I>,_US<J>,_US<K>,_US<L>,_US<M>,_US<N>,_US<O>,_US<P>,_US<Q>,_US<R>,_US<S>,_US<T>,_US<U>,_US<V>,_US<W>,_US<X>,_US<Y>,_US<Z>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>,_U<i,o,H>,_U<i,o,I>,_U<i,o,J>,_U<i,o,K>,_U<i,o,L>,_U<i,o,M>,_U<i,o,N>,_U<i,o,O>,_U<i,o,P>,_U<i,o,Q>,_U<i,o,R>,_U<i,o,S>,_U<i,o,T>,_U<i,o,U>,_U<i,o,V>,_U<i,o,W>,_U<i,o,X>,_U<i,o,Y>,_U<i,o,Z>,_U<i,o,$>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>,_US<H>,_US<I>,_US<J>,_US<K>,_US<L>,_US<M>,_US<N>,_US<O>,_US<P>,_US<Q>,_US<R>,_US<S>,_US<T>,_US<U>,_US<V>,_US<W>,_US<X>,_US<Y>,_US<Z>,_US<$>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,_>(targets: [_U<i,o,A>,_U<i,o,B>,_U<i,o,C>,_U<i,o,D>,_U<i,o,E>,_U<i,o,F>,_U<i,o,G>,_U<i,o,H>,_U<i,o,I>,_U<i,o,J>,_U<i,o,K>,_U<i,o,L>,_U<i,o,M>,_U<i,o,N>,_U<i,o,O>,_U<i,o,P>,_U<i,o,Q>,_U<i,o,R>,_U<i,o,S>,_U<i,o,T>,_U<i,o,U>,_U<i,o,V>,_U<i,o,W>,_U<i,o,X>,_U<i,o,Y>,_U<i,o,Z>,_U<i,o,$>,_U<i,o,_>]): [_US<A>,_US<B>,_US<C>,_US<D>,_US<E>,_US<F>,_US<G>,_US<H>,_US<I>,_US<J>,_US<K>,_US<L>,_US<M>,_US<N>,_US<O>,_US<P>,_US<Q>,_US<R>,_US<S>,_US<T>,_US<U>,_US<V>,_US<W>,_US<X>,_US<Y>,_US<Z>,_US<$>,_US<_>];

    <T extends E_UpdaterMultiple_CfgExemplar<i,o>>(targets: T): {
      [P in keyof T]: T[P] extends ((state: o, upValue: infer U) => i) ? _US<U> : never
    }
  }
}

interface E_UpdaterPartial<I, O> {
  updater: E_UpdaterMultiplePartial<I, O> & {
    <U>(func?: (state: O, upValue: U, upPrev: U) => I): Equals<U, unknown> extends true ? Signal : Signal<U, Will<U>>
  }
}
interface E_UpdatePartial<I, O> {
  update: {
    (func?: (value: O) => I): void                  // untracked by default
    (re: Re<I>): void

    track(func?: (value: O) => I): void
    track(re: Re<I>): void
    by: {
      <T>(re: Re<Will<T>>, updater?: (state: O, reValue: T, rePrev: WillExpand<Will<T>>) => I)
      <T>(re: Re<T>, updater?: (state: O, reValue: T, rePrev: T) => I)
      once: {
        <T>(re: Re<Will<T>>, updater?: (state: O, reValue: T, rePrev: WillExpand<Will<T>>) => I)
        <T>(re: Re<T>, updater?: (state: O, reValue: T, rePrev: T) => I)
      }
    }
  }
}
interface E_FilterUnTrackedPartial<O, Arg, Ret, WillRet> {
  filter: {
    (func: (value: Arg) => any, emptyValue: WillExtract<O>): Ret         // untracked by default
    (re: Re_Exemplar, emptyValue: WillExtract<O>): Ret
    (func?: (value: Arg) => any): WillRet
    (re?: Re_Exemplar): WillRet
    track(func: (value: Arg) => any, emptyValue: WillExtract<O>): Ret
    track(re: Re_Exemplar, emptyValue: WillExtract<O>): Ret
    track(func?: (value: Arg) => any): WillRet
    track(re?: Re_Exemplar): WillRet
    not: {
      (func: (value: Arg) => any, emptyValue: WillExtract<O>): Ret       // untracked by default
      (re: Re_Exemplar, emptyValue: WillExtract<O>): Ret
      (func?: (value: Arg) => any): WillRet
      (re?: Re_Exemplar): WillRet
      track(func: (value: Arg) => any, emptyValue: WillExtract<O>): Ret
      track(re: Re_Exemplar, emptyValue: WillExtract<O>): Ret
      track(func?: (value: Arg) => any): WillRet
      track(re?: Re_Exemplar): WillRet
    }
  }
}
interface E_PreFilterUnTrackedPartial<I, Ret> {
  filter: {
    (func?: (value: I) => any): Ret                                  // untracked by default
    (re?: Re_Exemplar): Ret
    track(func?: (value: I) => any): Ret
    track(re?: Re_Exemplar): Ret
    not: {
      (func?: (value: I) => any): Ret                               // untracked by default
      (re?: Re_Exemplar): Ret
      track(func?: (value: I) => any): Ret
      track(re?: Re_Exemplar): Ret
    }
  }
}

interface E_Readable<O, Ret> extends
  E_GetPartial<O>,
  E_PromisePartial<O>,
  E_SyncToPartial<O, Ret>,
  E_OpPartial<Ret>,
  E_SelectPartial<WillExpand<O>> {}

interface E_Writtable<I, O, Ret> extends
  E_Readable<O, Ret>,
  E_UpdatePartial<I, WillExpand<O>>,
  E_UpdaterPartial<I, WillExpand<O>> {}



interface E_Value<I, O> extends
  E_Writtable<I, O, Value<I, O>> {

  map: {
    <R>(func: (value: WillExpand<O>) => R): Value<I, R>         // tracked by default
    untrack<R>(func: (value: WillExpand<O>) => R): Value<I, R>
  }
  pre: E_PreFilterUnTrackedPartial<I, Value<I, O>> & {
    <N>(func?: (value: N, state: WillExpand<O>) => I): Value<N, O>  // untracked by default
    track<N>(func?: (value: N, state: WillExpand<O>) => I): Value<N, O>
  }
  wrap: {
    <N, R>(pre: (value: N, state: WillExpand<O>) => I, map: (value: WillExpand<O>) => R): Value<N, R>
  }
}


interface E_ValueReadonly<O> extends
  E_Readable<O, ValueReadonly<O>> {

  map: {
    <R>(func: (value: WillExpand<O>) => R): ValueReadonly<R>         // tracked by default
    untrack<R>(func: (value: WillExpand<O>) => R): ValueReadonly<R>
  }
}


interface E_Signal<I, O> extends
  E_Writtable<I, O, Signal<I, O>>,
  E_FilterUnTrackedPartial<O, WillExtract<O>, Signal<I, WillExtract<O>>, Signal<I, WillEnsure<O>>> {

  map: {
    <R>(func: (value: WillExtract<O>) => R): Signal<I, WillIf<O, R>>        // untracked by default
    track<R>(func: (value: WillExtract<O>) => R): Signal<I, WillIf<O, R>>

    to(): Signal<I, WillIf<O, undefined>>
    to<R>(value: R): Signal<I, WillIf<O, R>>
  }
  pre: E_PreFilterUnTrackedPartial<I, Signal<I, O>> & {
    <N>(func?: (value: N, state: WillExpand<O>) => I): Signal<N, O>       // untracked by default
    track<N>(func?: (value: N, state: WillExpand<O>) => I): Signal<N, O>
  }
  wrap: {
    <N, R>(pre: (value: N, state: WillExpand<O>) => I, map: (value: WillExtract<O>) => R): Signal<N, WillIf<O, R>>
  }
  as: {
    value(): Value<I, WillExpand<O>>
  }
}


interface E_SignalReadonly<O> extends
  E_Readable<O, SignalReadonly<O>>,
  E_FilterUnTrackedPartial<O, WillExtract<O>, SignalReadonly<WillExtract<O>>, SignalReadonly<WillEnsure<O>>> {

  map: {
    <R>(func: (value: WillExtract<O>) => R): SignalReadonly<R>        // untracked by default
    track<R>(func: (value: WillExtract<O>) => R): SignalReadonly<R>

    to(): SignalReadonly<WillIf<O, undefined>>
    to<R>(value: R): SignalReadonly<WillIf<O, R>>
  }
  as: {
    value(): ValueReadonly<WillExpand<O>>
  }
}

type E_IfAnyInput<I> = Equals<I, any> extends true ? (() => void) : {};


type Value<I = undefined, O = I> = E_SetPartial<I> & E_ValPartial<I, WillExpand<O>> & E_Value<I, O> & E_IfAnyInput<I>
type Signal<I = void, O = I> = E_SetPartial<I> & E_ValPartial<I, WillExpand<O>> & E_Signal<I, O> & E_IfAnyInput<I>

type ValueReadonly<O> = E_ValReadonlyPartial<WillExpand<O>> & E_ValueReadonly<O>
type SignalReadonly<O> = E_ValReadonlyPartial<WillExpand<O>> & E_SignalReadonly<O>




//
// Entry types
//


type ValueEntry = {
  (): Value;
  <T>(initial: T): Value<T>;

  trigger: {
    (): Value;
    <T>(initial: T): Value<T>;
  };

  from: {
    <O>(get: Re<O>): ValueReadonly<WillExpand<O>>
    <O, I>(get: Re<O>, set: ((value: I, state: WillExpand<O>) => void) | ReWrit<I>): Value<I, WillExpand<O>>
  }

  combine: {
    <A,r>(targets: [Re<A>], fn: (values: [A]) => r): ValueReadonly<r>;
    <A,B,r>(targets: [Re<A>,Re<B>], fn: (values: [A,B]) => r): ValueReadonly<r>;
    <A,B,C,r>(targets: [Re<A>,Re<B>,Re<C>], fn: (values: [A,B,C]) => r): ValueReadonly<r>;
    <A,B,C,D,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>], fn: (values: [A,B,C,D]) => r): ValueReadonly<r>;
    <A,B,C,D,E,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>], fn: (values: [A,B,C,D,E]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>], fn: (values: [A,B,C,D,E,F]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>], fn: (values: [A,B,C,D,E,F,G]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,H,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>], fn: (values: [A,B,C,D,E,F,G,H]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,H,I,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>], fn: (values: [A,B,C,D,E,F,G,H,I]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,H,I,J,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>], fn: (values: [A,B,C,D,E,F,G,H,I,J]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,H,I,J,K,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>], fn: (values: [A,B,C,D,E,F,G,H,I,J,K]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,H,I,J,K,L,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>], fn: (values: [A,B,C,D,E,F,G,H,I,J,K,L]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>], fn: (values: [A,B,C,D,E,F,G,H,I,J,K,L,M]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>], fn: (values: [A,B,C,D,E,F,G,H,I,J,K,L,M,N]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>], fn: (values: [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>], fn: (values: [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>], fn: (values: [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>], fn: (values: [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>], fn: (values: [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>], fn: (values: [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>], fn: (values: [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>,Re<V>], fn: (values: [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>,Re<V>,Re<W>], fn: (values: [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>,Re<V>,Re<W>,Re<X>], fn: (values: [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>,Re<V>,Re<W>,Re<X>,Re<Y>], fn: (values: [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>,Re<V>,Re<W>,Re<X>,Re<Y>,Re<Z>], fn: (values: [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>,Re<V>,Re<W>,Re<X>,Re<Y>,Re<Z>,Re<$>], fn: (values: [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$]) => r): ValueReadonly<r>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,_,r>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>,Re<V>,Re<W>,Re<X>,Re<Y>,Re<Z>,Re<$>,Re<_>], fn: (values: [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,_]) => r): ValueReadonly<r>;

    <T extends Re_CfgExemplar, r>(targets: T, fn: (values: {
      [P in keyof T]: T[P] extends { get: () => infer R } ? R : T[P] extends (() => infer R) ? R : T[P]
    }) => r): ValueReadonly<r>


    <A>(targets: [Re<A>]): ValueReadonly<[A]>;
    <A,B>(targets: [Re<A>,Re<B>]): ValueReadonly<[A,B]>;
    <A,B,C>(targets: [Re<A>,Re<B>,Re<C>]): ValueReadonly<[A,B,C]>;
    <A,B,C,D>(targets: [Re<A>,Re<B>,Re<C>,Re<D>]): ValueReadonly<[A,B,C,D]>;
    <A,B,C,D,E>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>]): ValueReadonly<[A,B,C,D,E]>;
    <A,B,C,D,E,F>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>]): ValueReadonly<[A,B,C,D,E,F]>;
    <A,B,C,D,E,F,G>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>]): ValueReadonly<[A,B,C,D,E,F,G]>;
    <A,B,C,D,E,F,G,H>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>]): ValueReadonly<[A,B,C,D,E,F,G,H]>;
    <A,B,C,D,E,F,G,H,I>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>]): ValueReadonly<[A,B,C,D,E,F,G,H,I]>;
    <A,B,C,D,E,F,G,H,I,J>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>]): ValueReadonly<[A,B,C,D,E,F,G,H,I,J]>;
    <A,B,C,D,E,F,G,H,I,J,K>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>]): ValueReadonly<[A,B,C,D,E,F,G,H,I,J,K]>;
    <A,B,C,D,E,F,G,H,I,J,K,L>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>]): ValueReadonly<[A,B,C,D,E,F,G,H,I,J,K,L]>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>]): ValueReadonly<[A,B,C,D,E,F,G,H,I,J,K,L,M]>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>]): ValueReadonly<[A,B,C,D,E,F,G,H,I,J,K,L,M,N]>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>]): ValueReadonly<[A,B,C,D,E,F,G,H,I,J,K,L,M,N,O]>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>]): ValueReadonly<[A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P]>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>]): ValueReadonly<[A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q]>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>]): ValueReadonly<[A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R]>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>]): ValueReadonly<[A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S]>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>]): ValueReadonly<[A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T]>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>]): ValueReadonly<[A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U]>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>,Re<V>]): ValueReadonly<[A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V]>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>,Re<V>,Re<W>]): ValueReadonly<[A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W]>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>,Re<V>,Re<W>,Re<X>]): ValueReadonly<[A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X]>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>,Re<V>,Re<W>,Re<X>,Re<Y>]): ValueReadonly<[A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y]>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>,Re<V>,Re<W>,Re<X>,Re<Y>,Re<Z>]): ValueReadonly<[A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z]>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>,Re<V>,Re<W>,Re<X>,Re<Y>,Re<Z>,Re<$>]): ValueReadonly<[A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$]>;
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,_>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>,Re<V>,Re<W>,Re<X>,Re<Y>,Re<Z>,Re<$>,Re<_>]): ValueReadonly<[A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,_]>;

    <T extends Re_CfgExemplar>(targets: T): ValueReadonly<{
      [P in keyof T]: T[P] extends { get: () => infer R } ? R : T[P] extends (() => infer R) ? R : T[P]
    }>

  }
}

type SignalEntry = {
  (): Signal;
  <T>(): Signal<T, Will<T>>;
  <T>(initial: T): Signal<T>;

  trigger: {
    (): Signal;
    <T>(): Signal<T, Will<T>>;
    <T>(initial: T): Signal<T>;

    flag: {
      (): Signal<void, boolean>;
      (initial: boolean): Signal<void, boolean>;

      invert: {
        (): Signal<void, boolean>;
        (initial: boolean): Signal<void, boolean>;
      }
    }
  };

  from: {
    <O>(get: Re<O>): SignalReadonly<O>
    <O, I>(get: Re<O>, set: ((value: I, state: O) => void) | ReWrit<I>): Signal<I, O>
  }
};



//
// Realar external api typings for React
//

type Observe = {
  <Props = {}>(FunctionComponent: FC<Props>): React.MemoExoticComponent<FC<Props>>;
  nomemo: {
    <Props = {}>(FunctionComponent: FC<Props>): FC<Props>;
  }
}
type UseScoped = {
  <M>(target: (new () => M) | (() => M)): M;
}
type UseLocal = {
  <M>(target: (new () => M) | (() => M)): M;
  <M, T extends any[]>(target: (new (...args: T) => M) | ((...args: T) => M), deps: T): M;
  <M>(target: (new () => M) | (() => M), deps: any[]): M;
}
type UseValue = {
  <T>(target: Re<T>, deps?: any[]): T;
}

type UseValues = {
  <A>(targets: [Re<A>], deps?: any[]): [A];
  <A,B>(targets: [Re<A>,Re<B>], deps?: any[]): [A,B];
  <A,B,C>(targets: [Re<A>,Re<B>,Re<C>], deps?: any[]): [A,B,C];
  <A,B,C,D>(targets: [Re<A>,Re<B>,Re<C>,Re<D>], deps?: any[]): [A,B,C,D];
  <A,B,C,D,E>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>], deps?: any[]): [A,B,C,D,E];
  <A,B,C,D,E,F>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>], deps?: any[]): [A,B,C,D,E,F];
  <A,B,C,D,E,F,G>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>], deps?: any[]): [A,B,C,D,E,F,G];
  <A,B,C,D,E,F,G,H>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>], deps?: any[]): [A,B,C,D,E,F,G,H];
  <A,B,C,D,E,F,G,H,I>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>], deps?: any[]): [A,B,C,D,E,F,G,H,I];
  <A,B,C,D,E,F,G,H,I,J>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>], deps?: any[]): [A,B,C,D,E,F,G,H,I,J];
  <A,B,C,D,E,F,G,H,I,J,K>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>], deps?: any[]): [A,B,C,D,E,F,G,H,I,J,K];
  <A,B,C,D,E,F,G,H,I,J,K,L>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>], deps?: any[]): [A,B,C,D,E,F,G,H,I,J,K,L];
  <A,B,C,D,E,F,G,H,I,J,K,L,M>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>], deps?: any[]): [A,B,C,D,E,F,G,H,I,J,K,L,M];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>], deps?: any[]): [A,B,C,D,E,F,G,H,I,J,K,L,M,N];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>], deps?: any[]): [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>], deps?: any[]): [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>], deps?: any[]): [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>], deps?: any[]): [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>], deps?: any[]): [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>], deps?: any[]): [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>], deps?: any[]): [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>,Re<V>], deps?: any[]): [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>,Re<V>,Re<W>], deps?: any[]): [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>,Re<V>,Re<W>,Re<X>], deps?: any[]): [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>,Re<V>,Re<W>,Re<X>,Re<Y>], deps?: any[]): [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>,Re<V>,Re<W>,Re<X>,Re<Y>,Re<Z>], deps?: any[]): [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>,Re<V>,Re<W>,Re<X>,Re<Y>,Re<Z>,Re<$>], deps?: any[]): [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,_>(targets: [Re<A>,Re<B>,Re<C>,Re<D>,Re<E>,Re<F>,Re<G>,Re<H>,Re<I>,Re<J>,Re<K>,Re<L>,Re<M>,Re<N>,Re<O>,Re<P>,Re<Q>,Re<R>,Re<S>,Re<T>,Re<U>,Re<V>,Re<W>,Re<X>,Re<Y>,Re<Z>,Re<$>,Re<_>], deps?: any[]): [A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,_];

  <T extends Re_CfgExemplar>(targets: T, deps?: any[]): {
    [P in keyof T]: T[P] extends { get: () => infer R } ? R : T[P] extends (() => infer R) ? R : T[P]
  }
}

type UseJsx = {
  <T = {}>(func: FC<T>, deps?: any[]): React.MemoExoticComponent<FC<T>>;
}


//
// Realar additions external api typings
//

type PoolEntry_BodyExemplar = {
  (...args: never[]): Promise<unknown>;
}
type PoolEntry = {
  <K extends PoolEntry_BodyExemplar>(body: K): Pool<K>
}

type Pool<K> = K & {
  count: ValueReadonly<number>;
  threads: ValueReadonly<(() => void)[]>;
  pending: ValueReadonly<boolean>;
};
