const
  jest_mock_ns = require("jest-mock"),
  { mock, unmock } = require("../lib");

let
  spy_factory = jest_mock_ns.fn.bind(jest_mock_ns);

module.exports = {
  mock: jest_mock,
  unmock
}

function jest_mock(unit) {
  return mock(unit, null, spy_factory);
}
