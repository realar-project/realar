import { pop, push } from "./core";
import { entry_start, entry_finish } from "./box";
import { link, link_scope_create, link_scope_start, link_scope_finish, mem_leak_free, unlink } from './link';
import { unit_key } from "./unit";
import { zone_seq_next, zone_start, zone_finish } from "./zone";

let
  mocks = new Map(),
  scope_seq_current = 0,
  slice_stack = [],
  slice_spy_factory = 0,
  slice_uniq = 0;

export {
  get_mock,
  is_test_scope_phase,
  mock,
  test_scope_start,
  test_scope_finish,
  unmock
}

function scope_seq_next() {
  return ++scope_seq_current;
}

function is_test_scope_phase() {
  return slice_uniq;
}

function test_scope_start(spy_factory) {
  slice_stack.push([slice_uniq, slice_spy_factory]);

  const uniq = scope_seq_next();
  slice_uniq = uniq;
  slice_spy_factory = spy_factory;

  push();
  const zone_id = zone_seq_next();
  zone_start(zone_id);
  const scope_id = link_scope_create(uniq);
  link(uniq);
  link_scope_start(scope_id);
  entry_start();
}

function test_scope_finish() {
  mem_leak_free();
  unlink(slice_uniq);
  entry_finish();
  link_scope_finish();
  zone_finish();
  unmock();
  pop();

  [slice_uniq, slice_spy_factory] = slice_stack.pop();
}

function get_mock(val) {
  return mocks.get(val);
}

function mock(val, fn) {
  if (!fn && slice_spy_factory) {
    const meta = val && val[unit_key];
    if (!meta) {
      const res = slice_spy_factory();
      mocks.set(val, res);
      return res;
    }

    const [methods] = meta;
    const inst = {};
    for (const key of methods) {
      inst[key] = slice_spy_factory();
    }
    const factory = function() {
      return inst;
    }

    mocks.set(val, factory);
    return inst;
  }

  mocks.set(val, fn);
}
function unmock() {
  const args = Array.prototype.slice(arguments);
  if (args.length) {
    for(const val of args) mock.delete(val);
  } else {
    mocks.clear();
  }
}

