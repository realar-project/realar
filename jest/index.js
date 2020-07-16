const
  lib_name = process.env.REALAR_DEV ? "../lib" : "realar",
  { test_scope_start, test_scope_finish } = require(lib_name);

beforeEach(() => test_scope_start(jest.fn));
afterEach(test_scope_finish);

// TODO:
// Add current mock factory for jest here. Between before and after sections

// const
//   jest_mock_ns = require("jest-mock"),
//   { mock, unmock } = require("../lib");

// let
//   spy_factory = jest_mock_ns.fn.bind(jest_mock_ns);

// module.exports = {
//   mock: jest_mock,
//   unmock
// }

// function jest_mock(unit) {
//   return mock(unit, null, spy_factory);
// }
