const
  afterEach = require("jest").afterEach;
  lib_name = process.env.REALAR_DEV ? "../lib" : "realar",
  unmock = require(lib_name).unmock;

afterEach(unmock);
