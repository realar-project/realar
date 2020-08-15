const
  path = require("path"),
  lib_name = process.env.REALAR_DEV ? path.join(__dirname, "../lib") : "realar",
  { ready, test_scope_start, test_scope_finish } = require(lib_name);

beforeEach((done) => ready(() => (test_scope_start(jest.fn), done())));
afterEach(test_scope_finish);
