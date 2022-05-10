import {
  sel,
  expr,
  box,
  untrack as rb_untrack,
  transaction as rb_batch,
  untrack
} from 'reactive-box';


export {
  re, wrap, read, write, update, select, readonly,
  on, sync, cycle,
  shared, free, mock, clear,
  event, filter, map,
  // unsubs, un,
  // batch, untrack,
  // observe, useRe, useLogic, useJsx,
  key
};


// React optional require.
let react;

/* istanbul ignore next */
try {
  react = require('react');
} catch {}

let x;

const key = '.remini';

const re = (v) => (x = {}, x[key] = box(v), x);

const wrap = () => {};

const read = (r) => r[key][0]();
const write = (r, v) => r[key][1](v);
const update = (r, fn) => {
  const f = untrack();
  const v = read(r);
  f();
  write(r, fn(v));
};

const select = () => {};
const readonly = () => {};

const on = () => {};
const sync = () => {};
const cycle = () => {};

const shared = () => {};
const free = () => {};
const mock = () => {};
const clear = () => {};

const event = () => {};
const filter = () => {};
const map = () => {};

//
// Enjoy and Happy Coding!
//
