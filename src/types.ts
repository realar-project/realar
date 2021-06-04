import { FC } from 'react';

/*
  [] select.multiple
  [] join
  [] signal.from
  [] value.from
  [] signal.trigger
  [] value.trigger
  [] signal.combine
  [] value.combine

  [] Later type -(Ensurable)
  [] Typings for op, sync and etc.


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
interface E_SelectPartial<O> {
  select: {
    <R>(func?: (value: O) => R): Selector<R>        // tracked by default
    untrack<R>(func?: (value: O) => R): Selector<R>
    multiple: {
      (cfg: any[]): any // TODO: .select.multiple typings
      untrack(cfg: any[]): any
    }
  }
}

type E_U_CfgExemplar<I, O> = {
  [key: string]: (state: O, upValue: never, upPrev: never) => I
}
type E_US<T> = Equals<T, unknown> extends true ? Signal : Signal<T>
type E_U<I,O,U> = ((state: O, upValue: U, upPrev: U) => I) | (() => I);

interface E_UpdaterMultiplePartial<i, o> {
  multiple: {
    <A>(targets: [E_U<i,o,A>]): [E_US<A>];
    <A,B>(targets: [E_U<i,o,A>,E_U<i,o,B>]): [E_US<A>,E_US<B>];
    <A,B,C>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>]): [E_US<A>,E_US<B>,E_US<C>];
    <A,B,C,D>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>];
    <A,B,C,D,E>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>];
    <A,B,C,D,E,F>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>];
    <A,B,C,D,E,F,G>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>];
    <A,B,C,D,E,F,G,H>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>,E_U<i,o,H>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>,E_US<H>];
    <A,B,C,D,E,F,G,H,I>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>,E_U<i,o,H>,E_U<i,o,I>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>,E_US<H>,E_US<I>];
    <A,B,C,D,E,F,G,H,I,J>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>,E_U<i,o,H>,E_U<i,o,I>,E_U<i,o,J>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>,E_US<H>,E_US<I>,E_US<J>];
    <A,B,C,D,E,F,G,H,I,J,K>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>,E_U<i,o,H>,E_U<i,o,I>,E_U<i,o,J>,E_U<i,o,K>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>,E_US<H>,E_US<I>,E_US<J>,E_US<K>];
    <A,B,C,D,E,F,G,H,I,J,K,L>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>,E_U<i,o,H>,E_U<i,o,I>,E_U<i,o,J>,E_U<i,o,K>,E_U<i,o,L>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>,E_US<H>,E_US<I>,E_US<J>,E_US<K>,E_US<L>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>,E_U<i,o,H>,E_U<i,o,I>,E_U<i,o,J>,E_U<i,o,K>,E_U<i,o,L>,E_U<i,o,M>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>,E_US<H>,E_US<I>,E_US<J>,E_US<K>,E_US<L>,E_US<M>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>,E_U<i,o,H>,E_U<i,o,I>,E_U<i,o,J>,E_U<i,o,K>,E_U<i,o,L>,E_U<i,o,M>,E_U<i,o,N>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>,E_US<H>,E_US<I>,E_US<J>,E_US<K>,E_US<L>,E_US<M>,E_US<N>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>,E_U<i,o,H>,E_U<i,o,I>,E_U<i,o,J>,E_U<i,o,K>,E_U<i,o,L>,E_U<i,o,M>,E_U<i,o,N>,E_U<i,o,O>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>,E_US<H>,E_US<I>,E_US<J>,E_US<K>,E_US<L>,E_US<M>,E_US<N>,E_US<O>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>,E_U<i,o,H>,E_U<i,o,I>,E_U<i,o,J>,E_U<i,o,K>,E_U<i,o,L>,E_U<i,o,M>,E_U<i,o,N>,E_U<i,o,O>,E_U<i,o,P>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>,E_US<H>,E_US<I>,E_US<J>,E_US<K>,E_US<L>,E_US<M>,E_US<N>,E_US<O>,E_US<P>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>,E_U<i,o,H>,E_U<i,o,I>,E_U<i,o,J>,E_U<i,o,K>,E_U<i,o,L>,E_U<i,o,M>,E_U<i,o,N>,E_U<i,o,O>,E_U<i,o,P>,E_U<i,o,Q>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>,E_US<H>,E_US<I>,E_US<J>,E_US<K>,E_US<L>,E_US<M>,E_US<N>,E_US<O>,E_US<P>,E_US<Q>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>,E_U<i,o,H>,E_U<i,o,I>,E_U<i,o,J>,E_U<i,o,K>,E_U<i,o,L>,E_U<i,o,M>,E_U<i,o,N>,E_U<i,o,O>,E_U<i,o,P>,E_U<i,o,Q>,E_U<i,o,R>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>,E_US<H>,E_US<I>,E_US<J>,E_US<K>,E_US<L>,E_US<M>,E_US<N>,E_US<O>,E_US<P>,E_US<Q>,E_US<R>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>,E_U<i,o,H>,E_U<i,o,I>,E_U<i,o,J>,E_U<i,o,K>,E_U<i,o,L>,E_U<i,o,M>,E_U<i,o,N>,E_U<i,o,O>,E_U<i,o,P>,E_U<i,o,Q>,E_U<i,o,R>,E_U<i,o,S>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>,E_US<H>,E_US<I>,E_US<J>,E_US<K>,E_US<L>,E_US<M>,E_US<N>,E_US<O>,E_US<P>,E_US<Q>,E_US<R>,E_US<S>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>,E_U<i,o,H>,E_U<i,o,I>,E_U<i,o,J>,E_U<i,o,K>,E_U<i,o,L>,E_U<i,o,M>,E_U<i,o,N>,E_U<i,o,O>,E_U<i,o,P>,E_U<i,o,Q>,E_U<i,o,R>,E_U<i,o,S>,E_U<i,o,T>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>,E_US<H>,E_US<I>,E_US<J>,E_US<K>,E_US<L>,E_US<M>,E_US<N>,E_US<O>,E_US<P>,E_US<Q>,E_US<R>,E_US<S>,E_US<T>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>,E_U<i,o,H>,E_U<i,o,I>,E_U<i,o,J>,E_U<i,o,K>,E_U<i,o,L>,E_U<i,o,M>,E_U<i,o,N>,E_U<i,o,O>,E_U<i,o,P>,E_U<i,o,Q>,E_U<i,o,R>,E_U<i,o,S>,E_U<i,o,T>,E_U<i,o,U>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>,E_US<H>,E_US<I>,E_US<J>,E_US<K>,E_US<L>,E_US<M>,E_US<N>,E_US<O>,E_US<P>,E_US<Q>,E_US<R>,E_US<S>,E_US<T>,E_US<U>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>,E_U<i,o,H>,E_U<i,o,I>,E_U<i,o,J>,E_U<i,o,K>,E_U<i,o,L>,E_U<i,o,M>,E_U<i,o,N>,E_U<i,o,O>,E_U<i,o,P>,E_U<i,o,Q>,E_U<i,o,R>,E_U<i,o,S>,E_U<i,o,T>,E_U<i,o,U>,E_U<i,o,V>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>,E_US<H>,E_US<I>,E_US<J>,E_US<K>,E_US<L>,E_US<M>,E_US<N>,E_US<O>,E_US<P>,E_US<Q>,E_US<R>,E_US<S>,E_US<T>,E_US<U>,E_US<V>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>,E_U<i,o,H>,E_U<i,o,I>,E_U<i,o,J>,E_U<i,o,K>,E_U<i,o,L>,E_U<i,o,M>,E_U<i,o,N>,E_U<i,o,O>,E_U<i,o,P>,E_U<i,o,Q>,E_U<i,o,R>,E_U<i,o,S>,E_U<i,o,T>,E_U<i,o,U>,E_U<i,o,V>,E_U<i,o,W>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>,E_US<H>,E_US<I>,E_US<J>,E_US<K>,E_US<L>,E_US<M>,E_US<N>,E_US<O>,E_US<P>,E_US<Q>,E_US<R>,E_US<S>,E_US<T>,E_US<U>,E_US<V>,E_US<W>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>,E_U<i,o,H>,E_U<i,o,I>,E_U<i,o,J>,E_U<i,o,K>,E_U<i,o,L>,E_U<i,o,M>,E_U<i,o,N>,E_U<i,o,O>,E_U<i,o,P>,E_U<i,o,Q>,E_U<i,o,R>,E_U<i,o,S>,E_U<i,o,T>,E_U<i,o,U>,E_U<i,o,V>,E_U<i,o,W>,E_U<i,o,X>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>,E_US<H>,E_US<I>,E_US<J>,E_US<K>,E_US<L>,E_US<M>,E_US<N>,E_US<O>,E_US<P>,E_US<Q>,E_US<R>,E_US<S>,E_US<T>,E_US<U>,E_US<V>,E_US<W>,E_US<X>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>,E_U<i,o,H>,E_U<i,o,I>,E_U<i,o,J>,E_U<i,o,K>,E_U<i,o,L>,E_U<i,o,M>,E_U<i,o,N>,E_U<i,o,O>,E_U<i,o,P>,E_U<i,o,Q>,E_U<i,o,R>,E_U<i,o,S>,E_U<i,o,T>,E_U<i,o,U>,E_U<i,o,V>,E_U<i,o,W>,E_U<i,o,X>,E_U<i,o,Y>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>,E_US<H>,E_US<I>,E_US<J>,E_US<K>,E_US<L>,E_US<M>,E_US<N>,E_US<O>,E_US<P>,E_US<Q>,E_US<R>,E_US<S>,E_US<T>,E_US<U>,E_US<V>,E_US<W>,E_US<X>,E_US<Y>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>,E_U<i,o,H>,E_U<i,o,I>,E_U<i,o,J>,E_U<i,o,K>,E_U<i,o,L>,E_U<i,o,M>,E_U<i,o,N>,E_U<i,o,O>,E_U<i,o,P>,E_U<i,o,Q>,E_U<i,o,R>,E_U<i,o,S>,E_U<i,o,T>,E_U<i,o,U>,E_U<i,o,V>,E_U<i,o,W>,E_U<i,o,X>,E_U<i,o,Y>,E_U<i,o,Z>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>,E_US<H>,E_US<I>,E_US<J>,E_US<K>,E_US<L>,E_US<M>,E_US<N>,E_US<O>,E_US<P>,E_US<Q>,E_US<R>,E_US<S>,E_US<T>,E_US<U>,E_US<V>,E_US<W>,E_US<X>,E_US<Y>,E_US<Z>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>,E_U<i,o,H>,E_U<i,o,I>,E_U<i,o,J>,E_U<i,o,K>,E_U<i,o,L>,E_U<i,o,M>,E_U<i,o,N>,E_U<i,o,O>,E_U<i,o,P>,E_U<i,o,Q>,E_U<i,o,R>,E_U<i,o,S>,E_U<i,o,T>,E_U<i,o,U>,E_U<i,o,V>,E_U<i,o,W>,E_U<i,o,X>,E_U<i,o,Y>,E_U<i,o,Z>,E_U<i,o,$>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>,E_US<H>,E_US<I>,E_US<J>,E_US<K>,E_US<L>,E_US<M>,E_US<N>,E_US<O>,E_US<P>,E_US<Q>,E_US<R>,E_US<S>,E_US<T>,E_US<U>,E_US<V>,E_US<W>,E_US<X>,E_US<Y>,E_US<Z>,E_US<$>];
    <A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,_>(targets: [E_U<i,o,A>,E_U<i,o,B>,E_U<i,o,C>,E_U<i,o,D>,E_U<i,o,E>,E_U<i,o,F>,E_U<i,o,G>,E_U<i,o,H>,E_U<i,o,I>,E_U<i,o,J>,E_U<i,o,K>,E_U<i,o,L>,E_U<i,o,M>,E_U<i,o,N>,E_U<i,o,O>,E_U<i,o,P>,E_U<i,o,Q>,E_U<i,o,R>,E_U<i,o,S>,E_U<i,o,T>,E_U<i,o,U>,E_U<i,o,V>,E_U<i,o,W>,E_U<i,o,X>,E_U<i,o,Y>,E_U<i,o,Z>,E_U<i,o,$>,E_U<i,o,_>]): [E_US<A>,E_US<B>,E_US<C>,E_US<D>,E_US<E>,E_US<F>,E_US<G>,E_US<H>,E_US<I>,E_US<J>,E_US<K>,E_US<L>,E_US<M>,E_US<N>,E_US<O>,E_US<P>,E_US<Q>,E_US<R>,E_US<S>,E_US<T>,E_US<U>,E_US<V>,E_US<W>,E_US<X>,E_US<Y>,E_US<Z>,E_US<$>,E_US<_>];

    <T extends E_U_CfgExemplar<i,o>>(targets: T): {
      [P in keyof T]: T[P] extends ((state: o, upValue: infer U) => i) ? E_US<U> : never
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



interface E_Value<I, O> extends
  E_GetPartial<O>,
  E_PromisePartial<O>,
  E_SyncToPartial<O, Value<I, O>>,
  E_UpdaterPartial<I, O>,
  E_OpPartial<Value<I, O>>,
  E_SelectPartial<O>,
  E_UpdatePartial<I, O>,
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

  // join: any // TODO: .join typings

  // TODO v0.7: flow: any
}


interface E_Signal<I, O> extends
  E_GetPartial<O>,
  E_PromisePartial<O>,
  E_SyncToPartial<O, Signal<I, O>>,
  E_UpdaterPartial<I, O>,
  E_OpPartial<Signal<I, O>>,
  E_SelectPartial<O>,
  E_UpdatePartial<I, O>,
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


  // flow: any // TODO: .flow typings
  // join: any // TODO: .join typings
}


interface E_Selector<O> extends
  E_GetPartial<O>,
  E_PromisePartial<O>,
  E_SyncToPartial<O, Selector<O>>,
  E_OpPartial<Selector<O>>,
  E_SelectPartial<O>,
  E_FilterTrackedPartial<O, Selector<O>> {

  map: {
    <R>(func: (value: O) => R): Selector<R>        // tracked by default
    untrack<R>(func: (value: O) => R): Selector<R>

    to<R>(value?: R): Selector<R>
  }

  // flow: any // TODO: .flow typings
  // join: any // TODO: .join typings
}


type Value<I = void, O = I> = E_SetPartial<I> & E_ValPartial<I, O> & E_Value<I, O>
type Signal<I = void, O = I> = E_SetPartial<I> & E_ValPartial<I, O> & E_Signal<I, O>
type Selector<O> = E_ValReadonlyPartial<O> & E_Selector<O>





//
// Entry types
//

type ValueEntry = {
  (): Value;
  <T>(initial: T): Value<T>;

  trigger: {
    (): any;
    (initial: any): any;

    flag: {
      (): any;
      (initial?: any): any;

      invert: {
        (): any
        (initial?: any): any
      }
    }
  };

  from: { (get: () => any, set?: (v) => any): any },
  combine: { (cfg: any): any }
}

type SignalEntry = {
  (): Signal;
  <T>(initial: T): Signal<T>;

  trigger: {
    (): any;
    (initial: any): any;

    flag: {
      (): any;
      (initial?: any): any;

      invert: {
        (): any
        (initial?: any): any
      }
    }
  };

  from: { (get: () => any, set?: (v) => any): any },
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
