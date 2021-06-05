import { FC } from 'react';

/*

  [] join -- with callback support
  [] signal.combine -- with callback support
  [] value.combine -- with callback support

  [] Typings for op, sync and etc.
  [] Later type -(Ensurable)

*/

export {
  ValueEntry,
  SignalEntry,
  SelectorEntry,

  Local,
  Contextual,

  Observe,
  UseScoped,
  UseLocal,
  UseValue,
  UseValues,
  UseJsx,

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

type Re_CfgExemplar = {
  [key: string]: Re<any>
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
  promise: Promise<O>
}
interface E_GetPartial<T> {
  get: () => T;
}
interface E_SyncToPartial<T, Ret> {
  sync(func: (value: T, prev: T) => void): Ret
  to: {
    (func: (value: T, prev: T) => void): Ret
    once(func: (value: T, prev: T) => void): Ret
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
  <A>(targets: [_S<o,A>]): [Selector<A>];
  <A,B>(targets: [_S<o,A>,_S<o,B>]): [Selector<A>,Selector<B>];
  <A,B,C>(targets: [_S<o,A>,_S<o,B>,_S<o,C>]): [Selector<A>,Selector<B>,Selector<C>];
  <A,B,C,D>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>];
  <A,B,C,D,E>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>];
  <A,B,C,D,E,F>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>];
  <A,B,C,D,E,F,G>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>];
  <A,B,C,D,E,F,G,H>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>,Selector<H>];
  <A,B,C,D,E,F,G,H,I>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>,Selector<H>,Selector<I>];
  <A,B,C,D,E,F,G,H,I,J>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>,Selector<H>,Selector<I>,Selector<J>];
  <A,B,C,D,E,F,G,H,I,J,K>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>,Selector<H>,Selector<I>,Selector<J>,Selector<K>];
  <A,B,C,D,E,F,G,H,I,J,K,L>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>,Selector<H>,Selector<I>,Selector<J>,Selector<K>,Selector<L>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>,Selector<H>,Selector<I>,Selector<J>,Selector<K>,Selector<L>,Selector<M>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>,Selector<H>,Selector<I>,Selector<J>,Selector<K>,Selector<L>,Selector<M>,Selector<N>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>,Selector<H>,Selector<I>,Selector<J>,Selector<K>,Selector<L>,Selector<M>,Selector<N>,Selector<O>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>,Selector<H>,Selector<I>,Selector<J>,Selector<K>,Selector<L>,Selector<M>,Selector<N>,Selector<O>,Selector<P>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>,Selector<H>,Selector<I>,Selector<J>,Selector<K>,Selector<L>,Selector<M>,Selector<N>,Selector<O>,Selector<P>,Selector<Q>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>,Selector<H>,Selector<I>,Selector<J>,Selector<K>,Selector<L>,Selector<M>,Selector<N>,Selector<O>,Selector<P>,Selector<Q>,Selector<R>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>,_S<o,S>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>,Selector<H>,Selector<I>,Selector<J>,Selector<K>,Selector<L>,Selector<M>,Selector<N>,Selector<O>,Selector<P>,Selector<Q>,Selector<R>,Selector<S>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>,_S<o,S>,_S<o,T>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>,Selector<H>,Selector<I>,Selector<J>,Selector<K>,Selector<L>,Selector<M>,Selector<N>,Selector<O>,Selector<P>,Selector<Q>,Selector<R>,Selector<S>,Selector<T>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>,_S<o,S>,_S<o,T>,_S<o,U>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>,Selector<H>,Selector<I>,Selector<J>,Selector<K>,Selector<L>,Selector<M>,Selector<N>,Selector<O>,Selector<P>,Selector<Q>,Selector<R>,Selector<S>,Selector<T>,Selector<U>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>,_S<o,S>,_S<o,T>,_S<o,U>,_S<o,V>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>,Selector<H>,Selector<I>,Selector<J>,Selector<K>,Selector<L>,Selector<M>,Selector<N>,Selector<O>,Selector<P>,Selector<Q>,Selector<R>,Selector<S>,Selector<T>,Selector<U>,Selector<V>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>,_S<o,S>,_S<o,T>,_S<o,U>,_S<o,V>,_S<o,W>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>,Selector<H>,Selector<I>,Selector<J>,Selector<K>,Selector<L>,Selector<M>,Selector<N>,Selector<O>,Selector<P>,Selector<Q>,Selector<R>,Selector<S>,Selector<T>,Selector<U>,Selector<V>,Selector<W>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>,_S<o,S>,_S<o,T>,_S<o,U>,_S<o,V>,_S<o,W>,_S<o,X>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>,Selector<H>,Selector<I>,Selector<J>,Selector<K>,Selector<L>,Selector<M>,Selector<N>,Selector<O>,Selector<P>,Selector<Q>,Selector<R>,Selector<S>,Selector<T>,Selector<U>,Selector<V>,Selector<W>,Selector<X>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>,_S<o,S>,_S<o,T>,_S<o,U>,_S<o,V>,_S<o,W>,_S<o,X>,_S<o,Y>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>,Selector<H>,Selector<I>,Selector<J>,Selector<K>,Selector<L>,Selector<M>,Selector<N>,Selector<O>,Selector<P>,Selector<Q>,Selector<R>,Selector<S>,Selector<T>,Selector<U>,Selector<V>,Selector<W>,Selector<X>,Selector<Y>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>,_S<o,S>,_S<o,T>,_S<o,U>,_S<o,V>,_S<o,W>,_S<o,X>,_S<o,Y>,_S<o,Z>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>,Selector<H>,Selector<I>,Selector<J>,Selector<K>,Selector<L>,Selector<M>,Selector<N>,Selector<O>,Selector<P>,Selector<Q>,Selector<R>,Selector<S>,Selector<T>,Selector<U>,Selector<V>,Selector<W>,Selector<X>,Selector<Y>,Selector<Z>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>,_S<o,S>,_S<o,T>,_S<o,U>,_S<o,V>,_S<o,W>,_S<o,X>,_S<o,Y>,_S<o,Z>,_S<o,$>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>,Selector<H>,Selector<I>,Selector<J>,Selector<K>,Selector<L>,Selector<M>,Selector<N>,Selector<O>,Selector<P>,Selector<Q>,Selector<R>,Selector<S>,Selector<T>,Selector<U>,Selector<V>,Selector<W>,Selector<X>,Selector<Y>,Selector<Z>,Selector<$>];
  <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,_>(targets: [_S<o,A>,_S<o,B>,_S<o,C>,_S<o,D>,_S<o,E>,_S<o,F>,_S<o,G>,_S<o,H>,_S<o,I>,_S<o,J>,_S<o,K>,_S<o,L>,_S<o,M>,_S<o,N>,_S<o,O>,_S<o,P>,_S<o,Q>,_S<o,R>,_S<o,S>,_S<o,T>,_S<o,U>,_S<o,V>,_S<o,W>,_S<o,X>,_S<o,Y>,_S<o,Z>,_S<o,$>,_S<o,_>]): [Selector<A>,Selector<B>,Selector<C>,Selector<D>,Selector<E>,Selector<F>,Selector<G>,Selector<H>,Selector<I>,Selector<J>,Selector<K>,Selector<L>,Selector<M>,Selector<N>,Selector<O>,Selector<P>,Selector<Q>,Selector<R>,Selector<S>,Selector<T>,Selector<U>,Selector<V>,Selector<W>,Selector<X>,Selector<Y>,Selector<Z>,Selector<$>,Selector<_>];

  <T extends E_SelectMultiple_CfgExemplar<o>>(targets: T): {
    [P in keyof T]: T[P] extends ((state: o) => infer U) ? Selector<U> : never
  }
}

interface E_SelectPartial<O> {
  select: {
    <R>(func?: (value: O) => R): Selector<R>        // tracked by default
    untrack<R>(func?: (value: O) => R): Selector<R>
    multiple: E_SelectMultiple_Func<O> & {
      untrack: E_SelectMultiple_Func<O>
    }
  }
}

type E_UpdaterMultiple_CfgExemplar<I, O> = {
  [key: string]: (state: O, upValue: never, upPrev: never) => I
}
type _US<T> = Equals<T, unknown> extends true ? Signal : Signal<T>
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
    <U>(func?: (state: O, upValue: U, upPrev: U) => I): Equals<U, unknown> extends true ? Signal : Signal<U>
  }
}
interface E_UpdatePartial<I, O> {
  update: {
    (func?: (value: O) => I): void                  // untracked by default
    track(func?: (value: O) => I): void
    by: {
      <T>(re: Re<T>, updater?: (state: O, reValue: T, rePrev: T) => I)
      once: {
        <T>(re: Re<T>, updater?: (state: O, reValue: T, rePrev: T) => I)
      }
    }
  }
}
interface E_FilterTrackedPartial<O, Ret> {
  filter: {
    (func?: (value: O) => any): Ret         // tracked by default
    untrack(func?: (value: O) => any): Ret
    not: {
      (func?: (value: O) => any): Ret       // tracked by default
      untrack(func?: (value: O) => any): Ret
    }
  }
}
interface E_FilterUnTrackedPartial<T, Ret> {
  filter: {
    (func?: (value: T) => any): Ret         // untracked by default
    track(func?: (value: T) => any): Ret
    not: {
      (func?: (value: T) => any): Ret       // untracked by default
      track(func?: (value: T) => any): Ret
    }
  }
}

interface E_Readable<O, Ret> extends
  E_GetPartial<O>,
  E_PromisePartial<O>,
  E_SyncToPartial<O, Ret>,
  E_OpPartial<Ret>,
  E_SelectPartial<O> {}

interface E_Writtable<I, O, Ret> extends
  E_Readable<O, Ret>,
  E_UpdatePartial<I, O>,
  E_UpdaterPartial<I, O> {}


interface E_Value<I, O> extends
  E_Writtable<I, O, Value<I, O>>,
  E_FilterTrackedPartial<O, Value<I, O>> {

  map: {
    <R>(func: (value: O) => R): Value<I, R>         // tracked by default
    untrack<R>(func: (value: O) => R): Value<I, R>

    to<R>(value?: R): Value<I, R>
  }
  pre: E_FilterTrackedPartial<I, Value<I, O>> & {
    <N>(func?: (value: N, state: O) => I): Value<N, O>  // tracked by default
    untrack<N>(func?: (value: N, state: O) => I): Value<N, O>
  }
  wrap: {
    <N, R>(pre: (value: N, state: O) => I, map: (value: O) => R): Value<N, R> // tracked by default
    untrack<N, R>(pre: (value: N, state: O) => I, map: (value: O) => R): Value<N, R>
  }

  // TODO 0.7: .flow typings
}
interface E_ValueReadonly<O> extends
  E_Readable<O, ValueReadonly<O>>,
  E_FilterTrackedPartial<O, ValueReadonly<O>> {

  map: {
    <R>(func: (value: O) => R): ValueReadonly<R>         // tracked by default
    untrack<R>(func: (value: O) => R): ValueReadonly<R>

    to<R>(value?: R): ValueReadonly<R>
  }
}


interface E_Signal<I, O> extends
  E_Writtable<I, O, Signal<I, O>>,
  E_FilterUnTrackedPartial<O, Signal<I, O>> {

  map: {
    <R>(func: (value: O) => R): Signal<I, R>        // untracked by default
    track<R>(func: (value: O) => R): Signal<I, R>

    to<R>(value?: R): Signal<I, R>
  }
  pre: E_FilterUnTrackedPartial<I, Signal<I, O>> & {
    <N>(func?: (value: N, state: O) => I): Signal<N, O>       // untracked by default
    track<N>(func?: (value: N, state: O) => I): Signal<N, O>
  }
  wrap: {
    <N, R>(pre: (value: N, state: O) => I, map: (value: O) => R): Signal<N, R> // untracked by default
    track<N, R>(pre: (value: N, state: O) => I, map: (value: O) => R): Signal<N, R>
  }
  as: {
    value(): Value<I, O>
  }

  // TODO 0.7: .flow typings
}
interface E_SignalReadonly<O> extends
  E_Readable<O, SignalReadonly<O>>,
  E_FilterUnTrackedPartial<O, SignalReadonly<O>> {

  map: {
    <R>(func: (value: O) => R): SignalReadonly<R>        // untracked by default
    track<R>(func: (value: O) => R): SignalReadonly<R>

    to<R>(value?: R): SignalReadonly<R>
  }

  as: {
    value(): ValueReadonly<O>
  }
}


interface E_Selector<O> extends
  E_Readable<O, Selector<O>>,
  E_FilterTrackedPartial<O, Selector<O>> {

  map: {
    <R>(func: (value: O) => R): Selector<R>        // tracked by default
    untrack<R>(func: (value: O) => R): Selector<R>

    to<R>(value?: R): Selector<R>
  }

  // TODO 0.7: .flow typings
}


type Value<I = void, O = I> = E_SetPartial<I> & E_ValPartial<I, O> & E_Value<I, O>
type Signal<I = void, O = I> = E_SetPartial<I> & E_ValPartial<I, O> & E_Signal<I, O>
type Selector<O> = E_ValReadonlyPartial<O> & E_Selector<O>

type ValueReadonly<O> = E_ValReadonlyPartial<O> & E_ValueReadonly<O>
type SignalReadonly<O> = E_ValReadonlyPartial<O> & E_SignalReadonly<O>




//
// Entry types
//


type ValueEntry = {
  (): Value;
  <T>(initial: T): Value<T>;

  trigger: {
    (): Value;
    <T>(initial: T): Value<T>;

    flag: {
      (): Value<boolean>;
      (initial: boolean): Value<boolean>;

      invert: {
        (): Value<boolean>;
        (initial: boolean): Value<boolean>;
      }
    }
  };

  from: {
    <O>(get: Re<O>): ValueReadonly<O>
    <O, I>(get: Re<O>, set: ((value: I, state: O) => void) | ReWrit<I>): Value<I, O>
  }

  combine: { (cfg: any): any }
}

type SignalEntry = {
  (): Signal;
  <T>(initial: T): Signal<T>;

  trigger: {
    (): Signal;
    <T>(initial: T): Signal<T>;

    flag: {
      (): Signal<boolean>;
      (initial: boolean): Signal<boolean>;

      invert: {
        (): Signal<boolean>;
        (initial: boolean): Signal<boolean>;
      }
    }
  };

  from: {
    <O>(get: Re<O>): SignalReadonly<O>
    <O, I>(get: Re<O>, set: ((value: I, state: O) => void) | ReWrit<I>): Signal<I, O>
  }

  combine: { (cfg: any): any }
};

type SelectorEntry = {
  <O>(fn: () => O): Selector<O>;
}


//
// Realar external api typings
//

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
}
type Untrack = {
  <T>(fn: () => T): T;
  unsafe: () => () => void;
}


//
// Realar external api typings for React
//

type Observe = {
  <T extends FC>(FunctionComponent: T): React.MemoExoticComponent<T>;
  nomemo: {
    <T extends FC>(FunctionComponent: T): T;
  }
}
type UseScoped = {
  <M>(target: (new () => M) | (() => M)): M;
}
type UseLocal = {
  <T extends unknown[], M>(
    target: (new (...args: T) => M) | ((...args: T) => M),
    deps?: T
  ): M;
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
    [P in keyof T]: T[P] extends Re<infer R> ? R : T[P]
  }
}

type UseJsx = {
  <T = {}>(func: FC<T>, deps?: any[]): React.MemoExoticComponent<FC<T>>;
}


//
// Realar additions external api typings
//

type PoolEntry_BodyExemplar = {
  (...args: any[]): Promise<any>;
}
type PoolEntry = {
  <K extends PoolEntry_BodyExemplar>(body: K): Pool<K>
}

type Pool<K> = K & {
  count: any;
  threads: any;
  pending: any;
};
