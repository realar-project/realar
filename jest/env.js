import { init } from "../lib";
import { test_scope_start, test_scope_finish } from "../lib/test";

beforeAll(done => init(done));
beforeEach(test_scope_start);
afterEach(test_scope_finish);
