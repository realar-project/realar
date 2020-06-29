import { createContext, createElement, useRef, useContext } from "./renderer";

let
  root_zone_id = 1,
  zone_seq_current = root_zone_id,
  zone_context = createContext(root_zone_id),
  current_zone_id = root_zone_id,
  zone_stack = [];

export {
  get_root_zone,
  get_current_zone,
  zone_start,
  zone_finish,
  Zone,
  useZone
}

function zone_seq_next() {
  return ++zone_seq_current;
}

function get_root_zone() {
  return root_zone_id;
}

function get_current_zone() {
  return current_zone_id;
}

function zone_start(id) {
  zone_stack.push(current_zone_id);
  current_zone_id = id;
}

function zone_finish() {
  current_zone_id = zone_stack.pop();
}

function Zone({ children, root, id } = {}) {
  const ref = useRef();
  if (!ref.current) {
    let zone_id;
    if (root) {
      zone_id = root_zone_id;
    } else if (id) {
      zone_id = id;
    } else {
      zone_id = zone_seq_next();
    }
    ref.current = zone_id;
  }
  return createElement(zone_context.Provider, {
    value: ref.current
  }, children);;
}

function useZone() {
  return useContext(zone_context);
}
