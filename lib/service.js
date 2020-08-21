import { connector } from "./connector";
import { link, unlink } from "./link";
import { useRef, useEffect } from "./renderer";
import { is_test_scope_phase } from "./test";
import { is_schema_phase } from "./unit";
import { get_root_zone, get_current_zone, useZone, zone_start, zone_finish } from "./zone";

const
  services = new Map(),
  const_empty_arr = [];

export {
  service,
  get_service,
  Service
}

function service(factory) {
  if (is_schema_phase()) {
    return connector(function() {
      const inst = get_service(factory);
      link(inst);
      return {
        get: () => inst
      }
    });
  }

  if (is_test_scope_phase()) {
    return get_service(factory);
  }

  throw new Error("service function supported only in unit schema and unit tests");
}

function get_service(factory) {
  let zone = get_current_zone();
  let zone_services = services.get(zone);
  if (!zone_services) {
    services.set(zone, (zone_services = new Map()));
  }
  let service = zone_services.get(factory);
  if (!service) {
    zone_services.set(factory, (service = factory()));
  }
  // TODO: subscribe to zone destroy, and free services map
  return service;
}

function Service({ unit, root, zone }) {
  let zone_id = useZone();
  if (root) {
    zone_id = get_root_zone();
  } else if (zone) {
    zone_id = zone;
  }
  const ref = useRef();
  if (!ref.current) {
    zone_start(zone_id);
    const inst = get_service(unit);
    link(inst);
    zone_finish();
    const unlink_effect = () => () => unlink(inst);
    ref.current = unlink_effect;
  }
  useEffect(ref.current, const_empty_arr);
  return null;
}
