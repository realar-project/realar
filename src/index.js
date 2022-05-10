import {
  sel,
  expr,
  box,
  untrack as _flat_untrack,
  transaction as _flat_batch
} from 'reactive-box';


export {
  re, wrap, read, write, update, select, readonly,
  on, once, sync, cycle,
  shared, free, mock, unmock, clear,
  event, filter, map,
  unsubs, un,
  batch, untrack,
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
const key_fn = 'fn';

const shareds = new Map();

let shared_unsubs = [];
let context_unsubs;


const _call_fns_array = (arr) => arr.forEach(fn => fn());

const _flat_unsubs = () => {
  const stack = context_unsubs;
  context_unsubs = [];
  return () => {
    const unsubs = context_unsubs;
    context_unsubs = stack;
    return () => unsubs && _call_fns_array(unsubs);
  };
};

const _safe_scope_fn = (m) => (
  (fn) => function () {
    const f = m();
    try { return fn.apply(this, arguments); }
    finally { f() }
  }
);
const _safe_scope = (m) => (
  (fn) => {
    const f = m();
    try { return fn() }
    finally { f() }
  }
);

const batch = _safe_scope(_flat_batch);
batch[key_fn] = _safe_scope_fn(_flat_batch);

const untrack = _safe_scope(_flat_untrack);
const untrack_fn = untrack[key_fn] = _safe_scope_fn(_flat_untrack);

const unsubs = _safe_scope(_flat_unsubs);
unsubs[key_fn] = _safe_scope_fn(_flat_unsubs);


const un = (unsub) => (
  unsub && context_unsubs && context_unsubs.push(unsub)
);


const _ent = (h) => {
  const ent = {};
  ent[key] = h;
  return ent;
};

const re = (v) => _ent(box(v));
const wrap = (r, w) => _ent([
  (r[key] ? r[key][0] : sel(r)[0]),
  (w && untrack_fn((v) => w[key] ? w[key][1](v) : w(v)))
]);

const read = (r) => r[key][0]();
const write = (r, v) => r[key][1](v);
const update = untrack_fn((r, fn) => write(r, fn(read(r))));

const select = (r, v) => _ent([sel(() => v(read(r)))[0]]);
const readonly = (r) => _ent([r[key][0]]);


const _sub_fn = (m /* 1 once, 2 sync */) => untrack_fn((r, fn) => {
  r = r[key] ? r[key][0] : sel(r)[0];
  let v;
  const e = expr(r, () => {
    const prev = v;
    fn(m === 1 ? r() : (v = e[0]()), prev);
  });
  un(e[1]);
  v = e[0]();
  if (m === 2) fn(v);
  return e[1];
});



const on = _sub_fn();
const once = _sub_fn(1);
const sync = _sub_fn(2);

const cycle = (fn) => {
  const e = expr(() => fn(stop));
  const stop = e[1];
  un(stop);
  e[0]();
  return stop;
};



const _inst = (target, args) => {
  let instance, unsub;
  const collect = _flat_unsubs();
  const track = _flat_untrack();
  try {
    instance =
      target.prototype === const_undef
        ? target(...args)
        : new target(...args);
  } finally {
    unsub = collect();
    track();
  }
  return [instance, unsub];
}

const shared = (fn) => {
  let inst = shareds.get(fn);
  if (!inst) {
    const h = _inst(target, []);
    inst = h[0];
    shared_unsubs.push(h[1]);
    shareds.set(target, inst);
  }
  return inst;
}

const free = () => {
  try {
    _call_fns_array(shared_unsubs);
  } finally {
    shareds.clear();
  }
}

const mock = (target, mocked) => (
  shareds.set(target, mocked),
  mocked
)

const unmock = (...targets) => (
  targets.concat(target).forEach(target => shareds.delete(target))
)

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
