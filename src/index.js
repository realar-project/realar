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
  observe, useRe, useLogic, useJsx, useWrite,
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
const key_all = 'all';
const key_unsafe = 'unsafe';
const key_untrack = 'untrack';
const key_function = 'function';

//
// Core
//

let context_unsubs;

const _flat_unsubs = () => {
  const stack = context_unsubs;
  context_unsubs = [];
  return () => {
    const unsubs = context_unsubs;
    context_unsubs = stack;
    return () => unsubs && unsubs.forEach(fn => fn())
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
batch[key_unsafe] = _flat_batch;

const untrack = _safe_scope(_flat_untrack);
const untrack_fn = untrack[key_fn] = _safe_scope_fn(_flat_untrack);
untrack[key_unsafe] = _flat_untrack;

const unsubs = _safe_scope(_flat_unsubs);
unsubs[key_fn] = _safe_scope_fn(_flat_unsubs);
unsubs[key_unsafe] = _flat_unsubs;


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
read[key_untrack] = untrack_fn(read);

const write = (r, v) => r[key][1](v);
const update = untrack_fn((r, fn) => write(r, fn(read(r))));

const select = (r, v) => _ent([sel(() => v(read(r)))[0]]);
const readonly = (r) => _ent([r[key][0]]);


const _sub_fn = (m /* 1 once, 2 sync */) => untrack_fn((r, fn) => {
  let v;
  const ev_fn = r[key] && r[key][2];
  r = r[key] ? r[key][0] : sel(r)[0];
  const e = expr(r, () => {
    const prev = v;
    v = m === 1
      ? (ev_fn ? ev_fn() : r())
      : (v = e[0](), (ev_fn ? ev_fn() : v));
    ev_fn ? fn(v) : fn(v, prev);
  });
  un(e[1]);
  v = e[0]();
  if (ev_fn) v = void 0;
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


const event = () => {
  const h = box([]);
  const fn = (v) => h[1]([v]);
  h[2] = sel(() => h[0]()[0])[0];
  fn[key] = h;
  return fn;
};

const map = (r, fn) => (
  (fn = untrack_fn(fn)),
  _ent([
    r[key][0],
    0,
    sel(() => fn(r[key][2]()))[0]
  ])
);

const filter = () => {};

//
// Shareds
//

const shareds = new Map();

const _inst = (target, args) => {
  args = args || [];
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
};

const shared = (fn) => {
  let rec = shareds.get(fn);
  if (!rec) {
    rec = _inst(target);
    shareds.set(target, rec);
  }
  return rec[0];
};

const free = (...targets) => {
  try {
    targets.forEach((target) => {
      const rec = shareds.get(target);
      rec && rec[1]();
    });
  } finally {
    targets.forEach((target) => shareds.delete(target));
  }
};
free[key_all] = () => {
  shareds.forEach((h) => h[1]());
  shareds.clear();
};

const mock = (target, mocked) => (
  shareds.set(target, [mocked, () => {}, 1]),
  mocked
);

const unmock = (...targets) => (
  targets.forEach(target => shareds.delete(target))
);
unmock[key_all] = () => (
  shareds.forEach((h, k) => h[2] && shareds.delete(k))
);

const clear = () => shareds.clear();



//
// React bindings
//

let context_is_observe;

const useForceUpdate = () => (
  react.useReducer(() => [], [])[1]
);

const useRe = (target, deps) => {
  deps || (deps = []);
  const force_update = context_is_observe || useForceUpdate();
  const h = react.useMemo(() => {
    if (!target) return [target, () => {}];
    if (target[key][0]) target = target[key][0];

    if (typeof target === key_function) {
      if (context_is_observe) {
        return [target, 0, 1];
      } else {
        const [run, stop] = expr(target, () => {
          force_update();
          run();
        });
        run();
        return [target, () => stop, 1];
      }
    } else {
      return [target, () => {}];
    }
  }, deps);

  context_is_observe || react.useEffect(h[1], [h]);
  return h[2] ? h[0]() : h[0];
};

const observe = () => {};
const useLogic = () => {};
const useJsx = () => {};

const useWrite = write;

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
