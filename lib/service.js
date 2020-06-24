import { useRef, useEffect } from "react";
import { Connector } from "./connector";
import { view } from "./view";
import {
  useZone,
  get_root_zone,
  get_current_zone,
  zone_start,
  zone_finish
} from "./zone";
import { link, unlink } from "./link";

const services = new Map();

export function service(Unit) {
  const connector = () => {
    const inst = get_service(Unit);
    return {
      get: () => inst,
      view: sync => view(inst, sync)
    };
  };
  connector[Connector] = true;
  return connector;
}

export function get_service(Unit) {
  let zone = get_current_zone();
  let zone_services = services.get(zone);
  if (!zone_services) {
    services.set(zone, (zone_services = new Map()));
  }
  let service = zone_services.get(Unit);
  if (!service) {
    zone_services.set(Unit, (service = Unit()));
  }
  return service;
}

export function Service({ unit, root, zone }) {
  let zone_id = useZone();
  if (root) {
    zone_id = get_root_zone();
  } else if (typeof zone === "number" || zone) {
    zone_id = zone;
  }
  const ref = useRef();
  if (!ref.current) {
    zone_start(zone_id);
    link((ref.current = get_service(unit)));
    zone_finish();
  }
  useEffect(() => () => unlink(ref.current), []);
  return null;
}
