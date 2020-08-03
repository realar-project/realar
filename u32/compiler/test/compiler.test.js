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
    log_1(n)
  `;

  expect(preprocess(code, __dirname)).toMatchSnapshot();
});
