const
  path = require("path"),
  lib_name = process.env.REALAR_DEV ? path.join(__dirname, "../lib") : "realar",
  { mock } = require(lib_name);

beforeEach(() => mock.s(jest.fn));
afterEach(mock.f);
