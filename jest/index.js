const
  lib_name = process.env.REALAR_DEV ? process.cwd() : "realar",
  { mock } = require(lib_name);

beforeEach(() => mock.s(jest.fn));
afterEach(mock.f);
