const babel = require('@babel/core');
const { decorator_fn_name, plugin } = require('../src/plugin');

function transform(code) {
  return babel.transform(code, {
    plugins: [plugin],
    code: true,
    ast: false,
  }).code;
}

describe('should work babel transform', () => {
  test('arrow jsx with args', () => {
    const code = `const a = (p) => <h1 />`;
    const expected = `const a = ${decorator_fn_name}(p => <h1 />);`;
    expect(transform(code)).toBe(expected);
  });

  test('arrow jsx no args', () => {
    const code = `const a = () => <h1 />`;
    const expected = `const a = ${decorator_fn_name}(() => <h1 />);`;
    expect(transform(code)).toBe(expected);
  });

  test('arrow no jsx return', () => {
    const code = `const a = () => 0`;
    const expected = `const a = () => 0;`;
    expect(transform(code)).toBe(expected);
  });

  test('processed arrow jsx', () => {
    const code = `const a = f((p) => <h1 />)`;
    const expected = `const a = f(p => <h1 />);`;
    expect(transform(code)).toBe(expected);
  });

  test('block arrow jsx with args', () => {
    const code = `const a = (p) => { return <h1 /> }`;
    const expected = `const a = ${decorator_fn_name}(p => {\n  return <h1 />;\n});`;
    expect(transform(code)).toBe(expected);
  });

  test('block arrow jsx no args', () => {
    const code = `const a = () => { return <h1 /> }`;
    const expected = `const a = ${decorator_fn_name}(() => {\n  return <h1 />;\n});`;
    expect(transform(code)).toBe(expected);
  });

  test('block arrow no return', () => {
    const code = `const a = () => {}`;
    const expected = `const a = () => {};`;
    expect(transform(code)).toBe(expected);
  });

  test('fn expr jsx', () => {
    const code = `const a = function a(p) { return <h1 /> }`;
    const expected = `const a = ${decorator_fn_name}(function a(p) {\n  return <h1 />;\n});`;
    expect(transform(code)).toBe(expected);
  });

  test('processed fn expr jsx', () => {
    const code = `const a = f(function a(p) { return <h1 /> })`;
    const expected = `const a = f(function a(p) {\n  return <h1 />;\n});`;
    expect(transform(code)).toBe(expected);
  });

  test('fn expr jsx no args', () => {
    const code = `const a = function() { return <h1 /> }`;
    const expected = `const a = ${decorator_fn_name}(function () {\n  return <h1 />;\n});`;
    expect(transform(code)).toBe(expected);
  });

  test('fn decl jsx with args', () => {
    const code = `function a(p) { return <h1 /> }`;
    const expected = `function a(p) {\n  return <h1 />;\n}`;
    expect(transform(code)).toBe(expected);
  });

  test('fn decl jsx no args', () => {
    const code = `function a() { return <h1 /> }`;
    const expected = `function a() {\n  return <h1 />;\n}`;
    expect(transform(code)).toBe(expected);
  });

  test('export fn decl jsx with args', () => {
    const code = `export function a(p) { return <h1 /> }`;
    const expected = `export function a(p) {\n  return <h1 />;\n}`;
    expect(transform(code)).toBe(expected);
  });

  test('export default fn decl jsx with args', () => {
    const code = `export default function a(p) { return <h1 /> }`;
    const expected = `export default function a(p) {\n  return <h1 />;\n}`;
    expect(transform(code)).toBe(expected);
  });
});
