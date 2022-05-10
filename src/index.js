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


let react;

/* istanbul ignore next */
try {
  // React optional require.
  react = require('react');
} catch {}

let x;

const key = '.remini';

const _ent = (h) => (x = {}, x[key] = h, x);

const re = (v) => _ent(box(v));
const wrap = (r, w) => _ent([
  (r[key] ? r[key][0] : r),
  (w && ((v) => (
    x = untrack(),
    w[key] ? w[key][1](v) : w(v),
    x()
  )))
]);

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

/*

Add the query syntax:

const $a = re(0)
re($a, select((a) => a.username), select((u) => u.nickname))

That expression should return readonly selected store, and

const $e = event();
event($e, filter((v) => v), map(v => v * 2));

This is a potentially non-obvious syntax, may be:

query($a) -> sinonym readonly api function
query($a, select((a) => a.username), select((u) => u.nickname))
query($e)
query($e, filter((v) => v), map(v => v * 2))

Hmmm, query is not a good idea, the first way more better

*/
