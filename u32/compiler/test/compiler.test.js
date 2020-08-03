import { preprocess } from "../preprocess";

const ENV = process.env;

beforeEach(() => {
  process.env = {};
});

afterEach(() => {
  process.env = ENV;
});

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
