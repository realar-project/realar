import {
  tick_start, tick_deep_inc
} from "../../lib/core/test";

test("should throw tick_start limit error", () => {

  for (let i = 0; i < 100; i++) {
    tick_deep_inc();
  }
  expect(() => {
    tick_start();
  }).toThrow("Tick deep limit exception")

});
