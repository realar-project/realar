import * as babel from "@babel/core";
import { view_call_name, plugin } from "../../babel/plugin";

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

test("should wrap functions with JSX", () => {
  const code = `
  function App() {
    return <div />;
  }
  export function Root() {
    return <App />;
  }`;
  const expected = `function App() {
  return ${view_call_name}(function () {
    return <div />;
  }, arguments, this);
}

export function Root() {
  return ${view_call_name}(function () {
    return <App />;
  }, arguments, this);
}`;
  expect(transform(code)).toBe(expected);
});

test("should wrap unit", () => {
  const code = `
    const Unit = unit({v:1});
  `;
  const expected = `const Unit = unit(function () {
  return {
    v: 1
  };
});`;
  expect(transform(code)).toBe(expected);
});


test("should process unit2", () => {
  const code = `
    const Unit = unit2({
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
      }
    });
  `;
  const unit2_core_name = "unit2.c";
  const unit2_fns_name = "unit2.f";
  const core_name = "_core";
  const expected = `const Unit = unit2(function () {
  let ${core_name} = ${unit2_core_name};

  let _e_id = ${core_name}[${box_expr_create}]();

  let _e_fn = () => {
    ${core_name}[${box_expr_start}](_e_id);

    this.v2 = this.v + this.n;

    ${core_name}[${box_expr_finish}]();
  };

  ${unit2_fns_name}.set(_e_id, _e_fn);

  let _c_cache,
      _c_id = ${core_name}[${box_computed_create}]();

  return [v => { /* constructor */
    ${core_name}[${box_entry_start}]();

    this.v = 10;
    this.v2 = v;

    ${core_name}[${box_entry_finish}]();
  }, 0 /* destr */, _e_id, _e_fn /* expr */, 1 /* v */, "A" /* v2 */, () => { /* n */
    if (${core_name}[${box_computed_start}](_c_id)) return _c_cache;
    return _c_cache = this.v + 1, ${core_name}[${box_computed_finish}](), _c_cache;
  }, (k, m = 5) => { /* m */
    m = m + 1;
    return this.v + this.v2 + k + m;
  }];
}, ["v", "v2"], ["n"], ["m"], []);`;
  expect(transform(code)).toBe(strip_multiline_comments(expected));
});

test("should process events, calls and signals for unit2", () => {
  const code = `
    const a = event();
    const s = signal();
    const Unit = unit2({
      [a]() {
        return 11;
      },
      async [s]() {
        return 12;
      },
      m() {}
    });
  `;
  const expected = `const a = event();
const s = signal();
const Unit = unit2(function () {
  return [0, 0, 0, 0, () => {}, () => {
    return 11;
  }, async () => {
    return 12;
  }];
}, [], [], ["m"], [a, s]);`;
  expect(transform(code)).toBe(expected);
});

test("should process changed for unit2 expression", () => {
  const code = `
    const Unit = unit2({
      a: 10,
      b: 11,
      expression() {
        if (changed(this.a)) return;
        if (changed(this.b, cmpfn)) return;
      }
    });
  `;
  const expected = `const Unit = unit2(function () {
  let _core = unit2.c;

  let _e_vals_map = new Map();

  let _e_id = _core[3]();

  let _e_fn = () => {
    _core[4](_e_id);

    if (changed(this.a, 0, _e_vals_map, 0)) return;
    if (changed(this.b, cmpfn, _e_vals_map, 1)) return;

    _core[5]();
  };

  unit2.f.set(_e_id, _e_fn);
  return [0, 0, _e_id, _e_fn, 10, 11];
}, ["a", "b"], [], [], []);`;
  expect(transform(code)).toBe(expected);
});

// test("Should wrap arrow functions with JSX", () => {
//   const code = `
//   const App = () => <div />;
//   export const Root = () => {
//     return <App />;
//   }`;
//   const expected = `const App = (...___arguments) => ___view_call(() => {
//   return <div />;
// }, ___arguments);

// export const Root = (...___arguments) => ___view_call(() => {
//   return <App />;
// }, ___arguments);`;
//   expect(transform(code)).toBe(expected);
//   // Ещё обработать export default
// });

// Ещё обработать ситуации когда внутри useService, useUnit
