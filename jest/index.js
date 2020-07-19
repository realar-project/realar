const
  path = require("path"),
  lib_name = process.env.REALAR_DEV ? path.join(__dirname, "../lib") : "realar",
  { test_scope_start, test_scope_finish } = require(lib_name);

beforeEach(() => test_scope_start(jest.fn));
afterEach(test_scope_finish);
