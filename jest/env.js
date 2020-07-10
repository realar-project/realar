import { init } from "../lib";
import { test_scope_start, test_scope_finish } from "../lib/test";


beforeEach(function (done) {
  init(function() {
    test_scope_start();
    done();
  });
});
afterEach(test_scope_finish);
