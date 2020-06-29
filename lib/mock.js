import { get_unit_factory_meta } from "./unit";

let
  mocks = new Map();

export {
  get_mock,
  mock,
  unmock
}

function get_mock(val) {
  return mocks.get(val);
}

function mock(val, fn, spy_factory) {
  if (!fn && spy_factory) {
    const meta = get_unit_factory_meta(val);
    if (!meta) {
      const res = spy_factory();
      mocks.set(val, res);
      return res;
    }

    const [methods] = meta;
    const inst = {};
    for (const key of methods) {
      inst[key] = spy_factory();
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

