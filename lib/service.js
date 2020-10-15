import { link, unlink } from "./link";
import { useRef, useEffect } from "./renderer";
import { is_test_scope_phase } from "./test";
import { is_schema_phase } from "./unit";
import { get_current_scope } from "./scope";

const
  services = new Map(),
  const_empty_arr = [];

export {
  service,
  get_service,
  Service
}

function service(factory) {
  if (is_schema_phase() || is_test_scope_phase()) {
    return get_service(factory);
  }

  throw new Error("`service` function supported only in unit schema and unit tests");
}

function get_service(factory) {
  let scope_id = get_current_scope();
  let scope_services = services.get(scope_id);
  if (!scope_services) {
    services.set(scope_id, (scope_services = new Map()));
  }
  let service = scope_services.get(factory);
  if (!service) {
    scope_services.set(factory, (service = factory()));
  }
  // TODO: subscribe to scope destroy, and free services map
  return service;
}

function Service({ unit }) {
  const ref = useRef();
  if (!ref.current) {
    const inst = get_service(unit);
    const link_id = link(inst);
    const unlink_effect = () => () => unlink(link_id);
    ref.current = unlink_effect;
  }
  useEffect(ref.current, const_empty_arr);
  return null;
}
