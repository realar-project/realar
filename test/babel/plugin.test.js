import * as babel from "@babel/core";
import { view_call_name, plugin } from "../../babel/plugin";

function transform(code) {
  return babel.transform(code, {
    plugins: [ plugin ],
    code: true,
    ast: false,
  }).code;
}

test("Should wrap functions with JSX", () => {
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

test("Should wrap unit", () => {
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
