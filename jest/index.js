const
  fn = require("jest").fn;
  lib_name = process.env.REALAR_DEV ? "../lib" : "realar",
  { mock, unmock } = require(lib_name);

module.exports = {
  mock: jest_mock,
  unmock
}

function jest_mock(unit) {
  return mock(unit, null, fn);
}
