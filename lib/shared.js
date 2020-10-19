import { link, unlink } from "./link";
import { useRef, useEffect } from "./renderer";
import { is_test_scope_phase } from "./test";
import { is_schema_phase } from "./unit";
import { get_current_scope } from "./scope";

const
  instances = new Map(),
  const_empty_arr = [];

export {
  shared,
  get_shared,
  Shared
}

function shared(factory) {
  if (is_schema_phase() || is_test_scope_phase()) {
    return get_shared(factory);
  }

  throw new Error("`shared` function supported only in unit schema and unit tests");
}

function get_shared(factory) {
  let scope_id = get_current_scope();
  let scope_instances = instances.get(scope_id);
  if (!scope_instances) {
    instances.set(scope_id, (scope_instances = new Map()));
  }
  let instance = scope_instances.get(factory);
  if (!instance) {
    scope_instances.set(factory, (instance = factory()));
  }
  // TODO: subscribe to scope destroy, and free instances map
  return instance;
}

function Shared({ unit }) {
  const ref = useRef();
  if (!ref.current) {
    const inst = get_shared(unit);
    const link_id = link(inst);
    const unlink_effect = () => () => unlink(link_id);
    ref.current = unlink_effect;
  }
  useEffect(ref.current, const_empty_arr);
  return null;
}
