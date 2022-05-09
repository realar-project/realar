import {
  sel,
  expr,
  box,
  untrack as rb_untrack,
  transaction as rb_batch
} from 'reactive-box';

//
// Exports.
//

export {
  re, get, set,
  // wrap, select, update,
  // on, sync, cycle,
  shared, free, mock, clear,
  // unsubs, un,
  // batch, untrack,
  // observe, useRe, useLogic, useJsx,
  key
};


//
// React optional require.
//

let react;

let useRef, useReducer, useEffect, useMemo, createElement, memo;

/* istanbul ignore next */
try {
  react = require('react');

  useRef = react.useRef;
  useReducer = react.useReducer;
  useEffect = react.useEffect;
  useMemo = react.useMemo;
  useContext = react.useContext;
  createContext = react.createContext;
  createElement = react.createElement;
  memo = react.memo;
} catch (e) {
  useRef = useReducer = useEffect = useMemo = createElement = memo = (() => {
    throw new Error('Missed "react" dependency');
  });
}

//
// Remini code here.
//

const key = '.remini';

let x;

const re = (v) => (x = {}, x[key] = box(v), x)
const get = (r) => r[key][0]()
const set = (r, v) => r[key][1](v)



const shared = () => {};
const free = () => {};
const mock = () => {};
const clear = () => {};



//
// End of File
// Enjoy and Happy Coding!
//
