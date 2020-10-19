import * as babel from "@babel/core";
import { plugin } from "../../babel/plugin";

const
  box_expr_create = 0,
  box_expr_start = 1,
  box_expr_finish = 2,
  box_computed_create = 3,
  box_computed_start = 4,
  box_computed_finish = 5,
  box_entry_start = 6,
  box_entry_finish = 7;

function transform(code) {
  return babel.transform(code, {
    plugins: [ plugin ],
    code: true,
    ast: false,
  }).code;
}

function strip_multiline_comments(code) {
  return code.replace(/\s*\/\*.*?\*\//mg, () => "");
}

test("should process unit", () => {
  const code = `
    const Unit = unit({
      v:1,
      get n() {
        return this.v + 1
      },
      expression() {
        this.v2 = this.v + this.n;
      },
      m(k, m = 5) {
        m = m + 1;
        return this.v + this.v2 + k + m;
      },
      v2: "A",
      constructor(v) {
        this.v = 10;
        this.v2 = v;
      },
      destructor() {}
    });
  `;
  const unit_core_name = "unit.c";
  const core_name = "_core";
  const expected = `const Unit = unit(function () {
  let ${core_name} = ${unit_core_name};

  let _e_id;

  let _e_fn = () => {
    ${core_name}[${box_expr_start}](_e_id);

    this.v2 = this.v + this.n;

    ${core_name}[${box_expr_finish}]();
  };

  _e_id = ${core_name}[${box_expr_create}](_e_fn);

  let _c_cache,
      _c_id = ${core_name}[${box_computed_create}]();

  return [v => { /* constructor */
    ${core_name}[${box_entry_start}]();

    this.v = 10;
    this.v2 = v;

    ${core_name}[${box_entry_finish}]();
  }, () => {} /* destr */, _e_id, _e_fn /* expr */, 1 /* v */, "A" /* v2 */, () => { /* n */
    if (${core_name}[${box_computed_start}](_c_id)) return _c_cache;
    return _c_cache = this.v + 1, ${core_name}[${box_computed_finish}](), _c_cache;
  }, (k, m = 5) => { /* m */
    m = m + 1;
    return this.v + this.v2 + k + m;
  }];
}, ["v", "v2"], ["n"], ["m"], []);`;
  expect(transform(code)).toBe(strip_multiline_comments(expected));
});

test("should process changed for unit expression", () => {
  const code = `
    const Unit = unit({
      a: 10,
      b: 11,
      expression() {
        if (changed(this.a)) return;
        if (changed(this.b, cmpfn)) return;
      }
    });
  `;
  const expected = `const Unit = unit(function () {
  let _core = unit.c;

  let _e_vals_map = new Map();

  let _e_id;

  let _e_fn = () => {
    _core[${box_expr_start}](_e_id);

    if (changed(this.a, 0, _e_vals_map, 0)) return;
    if (changed(this.b, cmpfn, _e_vals_map, 1)) return;

    _core[${box_expr_finish}]();
  };

  _e_id = _core[${box_expr_create}](_e_fn);
  return [0, 0, _e_id, _e_fn, 10, 11];
}, ["a", "b"], [], [], []);`;
  expect(transform(code)).toBe(expected);
});

test("should transform unit with arrow func methods", () => {
  const code = `
  export const notifier = unit({
    ok: () => {},
    fail: (code) => -code,
    [counter]: val => (this.current = val)
  });
  `;
  const expected = `export const notifier = unit(function () {
  return [0, 0, 0, 0, () => {}, code => {
    return -code;
  }, val => {
    return this.current = val;
  }];
}, [], [], ["ok", "fail"], [counter]);`;
  expect(transform(code)).toBe(expected);
});

test("should transform async unit methods", () => {
  const code = `
  const u = unit({
    async m1() {
      return await fetch(1);
    },
    m2: async () => {
      await fetch(2);
    },
    action: async () => await call(),
  });
  `;
  const expected = `const u = unit(function () {
  let _m_proc = 0,
      _m_fn = async (...args) => {
    _m_fn.pending = ++_m_proc > 0;·
    try {
      return await async function () {
        return await fetch(1);
      }.apply(this, args);
    } finally {
      _m_fn.pending = --_m_proc > 0;
    }
  };·
  Object.defineProperty(_m_fn, \"pending\", unit.b(false));·
  let _m_proc2 = 0,
      _m_fn2 = async (...args) => {
    _m_fn2.pending = ++_m_proc2 > 0;·
    try {
      return await async function () {
        await fetch(2);
      }.apply(this, args);
    } finally {
      _m_fn2.pending = --_m_proc2 > 0;
    }
  };·
  Object.defineProperty(_m_fn2, \"pending\", unit.b(false));·
  let _m_proc3 = 0,
      _m_fn3 = async (...args) => {
    _m_fn3.pending = ++_m_proc3 > 0;·
    try {
      return await async function () {
        return await call();
      }.apply(this, args);
    } finally {
      _m_fn3.pending = --_m_proc3 > 0;
    }
  };·
  Object.defineProperty(_m_fn3, \"pending\", unit.b(false));
  return [0, 0, 0, 0, _m_fn, _m_fn2, _m_fn3];
}, [], [], [\"m1\", \"m2\", \"action\"], []);`.replace(/·/gm, "\n");

  expect(transform(code)).toBe(expected);
});

test("should transform unit with anonymous func methods", () => {
  const code = `
  export const notifier = unit({
    a: 10,
    ok: function () {},
    fail: function f(code) { return -code + this.a },
    [counter]: function (val) { return this.current = val + this.a },
    m: async function m(val) {
      return this.a + val + Number(m.pending);
    }
  });
  `;
  const expected = `export const notifier = unit(function () {
  let _m_proc = 0,
      _m_fn = async function m() {
    _m_fn.pending = ++_m_proc > 0;·
    try {
      return await async function (val) {
        return this.a + val + Number(m.pending);
      }.apply(this, arguments);
    } finally {
      _m_fn.pending = --_m_proc > 0;
    }
  }.bind(this);·
  Object.defineProperty(_m_fn, \"pending\", unit.b(false));
  return [0, 0, 0, 0, 10, function () {}.bind(this), function f(code) {
    return -code + this.a;
  }.bind(this), _m_fn, function (val) {
    return this.current = val + this.a;
  }.bind(this)];
}, [\"a\"], [], [\"ok\", \"fail\", \"m\"], [counter]);`.replace(/·/gm, "\n");
  expect(transform(code)).toBe(expected);
});


