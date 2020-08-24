const
  path = require("path"),
  lib_name = process.env.REALAR_DEV ? path.join(__dirname, "../lib") : "realar",
  { ready, mock } = require(lib_name);

beforeEach((done) => ready(() => (mock.s(jest.fn), done())));
afterEach(mock.f);
