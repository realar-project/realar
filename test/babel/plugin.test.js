import * as babel from "@babel/core";
import { view_call_name, plugin } from "../../babel/plugin";

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
  const f_name = "unit2";
  const expected = `const Unit = unit2(function () {
  let _e_id = ${f_name}.b3/*box_expr_create*/();

  let _e_fn = () => {
    ${f_name}.b4/*box_expr_start*/(_e_id);
    this.v2 = this.v + this.n;
    ${f_name}.b5/*box_expr_finish*/();
  };

  ${f_name}.expr/*box_expr*/(_e_id, _e_fn);

  let _c_cache,
      _c_id = ${f_name}.b7/*box_computed_create*/();

  return [v => { /* constructor */
    ${f_name}.ba/*box_entry_start*/();
    this.v = 10;
    this.v2 = v;
    ${f_name}.bb/*box_entry_finish*/();
  }, 0 /* destr */, _e_fn /* expr */, 1 /* v */, "A" /* v2 */, () => { /* n */
    if (${f_name}.b8/*box_computed_start*/(_c_id)) return _c_cache;
    return _c_cache = this.v + 1, ${f_name}.b9/*box_computed_finish*/(), _c_cache;
  }, (k, m = 5) => { /* m */
    m = m + 1;
    return this.v + this.v2 + k + m;
  }];
}, ["v", "v2"], ["n"], ["m"]);`;
  expect(transform(code)).toBe(strip_multiline_comments(expected));
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
