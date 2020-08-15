import { preprocess } from "../preprocess";

const ENV = process.env;
beforeEach(() => (process.env = {}));
afterEach(() => (process.env = ENV));

test("should work code snapshot", () => {
  let code = `## import code/index`;

  expect(preprocess(code, __dirname)).toMatchSnapshot();
});

test("should work for section for set", () => {
  let code = `
func a(k)
  for n of set k
    for j of set n
      log_2(n, j)
  `;

  expect(preprocess(code, __dirname)).toMatchSnapshot();
});

test("should work bool operations", () => {
  let code = `
func tick_finish
  if tick_deep() > 1 || !set_size(tick_changed())
    [tick_deep_ptr()] = tick_deep() - 1
  `;
  expect(preprocess(code, __dirname)).toMatchSnapshot();
});

test("should work return op", () => {
  let code = `
func a
  return
  `;
  expect(preprocess(code, __dirname)).toMatchSnapshot();
});

test("should work global op", () => {
  let code = `
global a b c
global e f1 a_5

func func1 result
  m = 10
  e + f1 + a_5 + a + b + c + m + t

global t

func func2 result
  m = 10
  l = 11
  p = 15
  a + m + l + f1 + p + t

func func3
  for x of set a
    call(x + c)
  `;
  expect(preprocess(code, __dirname)).toMatchSnapshot();
});

test("should work correct sub op priority", () => {
  let code = `
func a(size index) result
  size - index - 1
  `;
  expect(preprocess(code, __dirname)).toMatchSnapshot();
});
