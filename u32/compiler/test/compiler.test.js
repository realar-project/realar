import { preprocess } from "../preprocess";

const ENV = process.env;
beforeEach(() => (process.env = {}));
afterEach(() => (process.env = ENV));

test("should work", () => {
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
