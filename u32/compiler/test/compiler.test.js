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