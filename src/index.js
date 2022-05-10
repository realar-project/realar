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
  on, once, sync, cycle,
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

const key = '.remini';

const _ent = (h) => {
  const ent = {};
  ent[key] = h;
  return ent;
};

const re = (v) => _ent(box(v));
const wrap = (r, w) => _ent([
  (r[key] ? r[key][0] : sel(r)[0]),
  (w && ((v) => {
    const f = untrack();
    w[key] ? w[key][1](v) : w(v);
    f();
  }))
]);

const read = (r) => r[key][0]();
const write = (r, v) => r[key][1](v);
const update = (r, fn) => {
  const f = untrack();
  const v = read(r);
  f();
  write(r, fn(v));
};

const select = (r, v) => _ent([sel(() => v(read(r)))[0]]);
const readonly = (r) => _ent([r[key][0]]);


const _sub = (r, fn, m /* 1 once, 2 sync */) => {
  r = r[key] ? r[key][0] : sel(r)[0];
  let v;
  const e = expr(r, () => {
    const prev = v;
    fn(m === 1 ? r() : (v = e[0]()), prev);
  });
  un(e[1]);
  v = e[0]();
  if (m === 2) {
    const f = untrack();
    fn(v);
    f();
  }
  return e[1];
}


const un = () => {};

const on = (r, fn) => _sub(r, fn);
const once = (r, fn) => _sub(r, fn, 1);
const sync = (r, fn) => _sub(r, fn, 2);

const cycle = (fn) => {
  const e = expr(() => fn(stop));
  const stop = e[1];
  un(stop);
  e[0]();
  return stop;
}

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

*/
