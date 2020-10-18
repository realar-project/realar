import { link, link_scope_create, link_scope_start, link_scope_finish, mem_leak_free, unlink } from './link';
import { unit_methods_key } from "./unit";

let
  mocks = new Map(),
  scope_seq_current = 0,
  slice_stack = [],
  slice_spy_factory = 0,
  slice_test_scope_id = 0,
  slice_link_id = 0;

mock.s = test_scope_start;
mock.f = test_scope_finish;

export {
  get_mock,
  is_test_scope_phase,
  mock,
  unmock
}

function scope_seq_next() {
  return ++scope_seq_current;
}

function is_test_scope_phase() {
  return slice_test_scope_id;
}

function test_scope_start(spy_factory) {
  slice_stack.push([slice_test_scope_id, slice_spy_factory, slice_link_id]);

  const test_scope_id = scope_seq_next();
  slice_test_scope_id = test_scope_id;
  slice_spy_factory = spy_factory;

  const link_scope_id = link_scope_create(test_scope_id);
  slice_link_id = link(link_scope_id);

  link_scope_start(link_scope_id);
}

function test_scope_finish() {
  unlink(slice_link_id);
  mem_leak_free();
  link_scope_finish();
  unmock();

  [slice_test_scope_id, slice_spy_factory, slice_link_id] = slice_stack.pop();
}

function get_mock(val) {
  return mocks.get(val);
}

function mock(val, fn) {
  if (!fn && slice_spy_factory) {
    let methods = null;
    if (val && val[unit_methods_key]) {
      methods = val[unit_methods_key];
    }

    if (!methods) {
      throw "Test mocks ony unit supported";
    }

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
  const args = Array.prototype.slice.call(arguments);
  if (args.length) {
    for(const val of args) mock.delete(val);
  } else {
    mocks.clear();
  }
}

