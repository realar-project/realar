import * as babel from "@babel/core";
import { plugin } from "../../babel/plugin";
import { view_unit_name } from "../../babel/view-transform";

const
  box_expr_create = 3,      /* b3 */
  box_expr_start = 4,       /* b4 */
  box_expr_finish = 5,      /* b5 */
  box_computed_create = 6,  /* b6 */
  box_computed_start = 7,   /* b7 */
  box_computed_finish = 8,  /* b8 */
  box_entry_start = 9,      /* b9 */
  box_entry_finish = 10     /* ba */
;

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
  const unit_fns_name = "unit.f";
  const core_name = "_core";
  const expected = `const Unit = unit(function () {
  let ${core_name} = ${unit_core_name};

  let _e_id = ${core_name}[${box_expr_create}]();

  let _e_fn = () => {
    ${core_name}[${box_expr_start}](_e_id);

    this.v2 = this.v + this.n;

    ${core_name}[${box_expr_finish}]();
  };

  ${unit_fns_name}.set(_e_id, _e_fn);

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

test("should process events, calls and signals for unit", () => {
  const code = `
    const a = action();
    const s = signal();
    const Unit = unit({
      [a]() {
        return 11;
      },
      async [s]() {
        return 12;
      },
      m() {}
    });
  `;
  const expected = `const a = action();
const s = signal();
const Unit = unit(function () {
  return [0, 0, 0, 0, () => {}, () => {
    return 11;
  }, async () => {
    return 12;
  }];
}, [], [], ["m"], [a, s]);`;
  expect(transform(code)).toBe(expected);
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

  let _e_id = _core[3]();

  let _e_fn = () => {
    _core[4](_e_id);

    if (changed(this.a, 0, _e_vals_map, 0)) return;
    if (changed(this.b, cmpfn, _e_vals_map, 1)) return;

    _core[5]();
  };

  unit.f.set(_e_id, _e_fn);
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

test("should work unit inside func with JSX", () => {
  const code = `
  test(() => {
    const u_f = unit({
      constructor(...args) {
        constr(...args);
      },
      destructor() {
        destr();
      }
    });
    const el = mount(<A/>);
  })`;
  const expected = `test(() => {
  let _c_unit_v = ${view_unit_name},
      _c_ret_tmp;

  _c_unit_v[0]();

  const u_f = unit(function () {
    let _core = unit.c;
    return [(...args) => {
      _core[9]();

      constr(...args);

      _core[10]();
    }, () => {
      destr();
    }, 0, 0];
  }, [], [], [], []);
  const el = mount(<A />);

  _c_unit_v[1]();
});`;
  expect(transform(code)).toBe(expected);
});

test("should transform nested functions JSX", () => {
  const code = `
    function _() {
      function A() {
        return <div />;
      }
    }
  `;
  const expected = `function _() {
  function A() {
    let _c_unit_v = ${view_unit_name},
        _c_ret_tmp;

    _c_unit_v[0]();

    return _c_ret_tmp = <div />, _c_unit_v[1](), _c_ret_tmp;
  }
}`;
  expect(transform(code)).toBe(expected);
});

test("should transform JSX functions with JSX functions", () => {
  const code = `
    function _() {
      function A() {
        function B() {
          return <div />;
        }
        return <div />;
      }
    }
  `;
  const expected = `function _() {
  function A() {
    let _c_unit_v2 = ${view_unit_name},
        _c_ret_tmp2;

    _c_unit_v2[0]();

    function B() {
      let _c_unit_v = ${view_unit_name},
          _c_ret_tmp;

      _c_unit_v[0]();

      return _c_ret_tmp = <div />, _c_unit_v[1](), _c_ret_tmp;
    }

    return _c_ret_tmp2 = <div />, _c_unit_v2[1](), _c_ret_tmp2;
  }
}`;
  expect(transform(code)).toBe(expected);
});

test("should transform expression functions JSX", () => {
  const code = `
    export const App = function() {
      useService(Unit);
      return null;
    }
    export const H1 = function() {
      return <h1 />;
    }
  `;
  const expected = `export const App = function () {
  let _c_unit_v = ${view_unit_name},
      _c_ret_tmp;

  _c_unit_v[0]();

  useService(Unit);
  return _c_ret_tmp = null, _c_unit_v[1](), _c_ret_tmp;
};
export const H1 = function () {
  let _c_unit_v2 = ${view_unit_name},
      _c_ret_tmp2;

  _c_unit_v2[0]();

  return _c_ret_tmp2 = <h1 />, _c_unit_v2[1](), _c_ret_tmp2;
};`;
  expect(transform(code)).toBe(expected);
});

test("should transform arrow functions JSX", () => {
  const code = `
    export const App = () => {
      useService(Unit);
      return null
    }
    export const H1 = () => <h1 />;
    export const A = ({ p }) => {
      if (p) return <p />;
      return <b />;
    };
  `;
  const expected = `export const App = () => {
  let _c_unit_v = ${view_unit_name},
      _c_ret_tmp;

  _c_unit_v[0]();

  useService(Unit);
  return _c_ret_tmp = null, _c_unit_v[1](), _c_ret_tmp;
};
export const H1 = () => {
  let _c_unit_v2 = ${view_unit_name},
      _c_ret_tmp2;

  _c_unit_v2[0]();

  return _c_ret_tmp2 = <h1 />, _c_unit_v2[1](), _c_ret_tmp2;
};
export const A = ({
  p
}) => {
  let _c_unit_v3 = ${view_unit_name},
      _c_ret_tmp3;

  _c_unit_v3[0]();

  if (p) return _c_ret_tmp3 = <p />, _c_unit_v3[1](), _c_ret_tmp3;
  return _c_ret_tmp3 = <b />, _c_unit_v3[1](), _c_ret_tmp3;
};`;
  expect(transform(code)).toBe(expected);
});

test("should transform JSX manipulations", () => {
  const code = `function Whirl({ children }) {
    const { map, shift, push } = useUnit(whirl);
    return (
      <>
        <button onClick={shift}>-</button>
        {map(key => (
          <Scope key={key}>
            {children}
          </Scope>
        ))}
        <button onClick={push}>+</button>
      </>
    )
  }`;
  const expected = `function Whirl({
  children
}) {
  let _c_unit_v = ${view_unit_name},
      _c_ret_tmp;

  _c_unit_v[0]();

  const {
    map,
    shift,
    push
  } = useUnit(whirl);
  return _c_ret_tmp = <>
        <button onClick={shift}>-</button>
        {map(key => {
      let _c_unit_v2 = ${view_unit_name},
          _c_ret_tmp2;

      _c_unit_v2[0]();

      return _c_ret_tmp2 = <Scope key={key}>
            {children}
          </Scope>, _c_unit_v2[1](), _c_ret_tmp2;
    })}
        <button onClick={push}>+</button>
      </>, _c_unit_v[1](), _c_ret_tmp;
}`;
  expect(transform(code)).toBe(expected);
});


