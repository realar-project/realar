import React, { useRef, useContext } from "react";

let zone_seq_current = 0,
  root_zone_id = 0,
  zone_context = React.createContext(root_zone_id),
  current_zone_id = root_zone_id,
  zone_stack = [];

function zone_seq_next() {
  return ++zone_seq_current;
}

export function get_root_zone() {
  return root_zone_id;
}

export function get_current_zone() {
  return current_zone_id;
}

export function zone_start(id) {
  zone_stack.push(current_zone_id);
  current_zone_id = id;
}

export function zone_finish() {
  current_zone_id = zone_stack.pop();
}

export function Zone({ children, root, id }) {
  const ref = useRef();
  if (!ref.current) {
    let zone_id;
    if (root) {
      zone_id = root_zone_id;
    } else if (typeof id === "number" || id) {
      zone_id = id;
    } else {
      zone_id = zone_seq_next();
    }
    ref.current = zone_id;
  }
  return (
    <zone_context.Provider value={ref.current}>
      {children}
    </zone_context.Provider>
  );
}

export function useZone() {
  return useContext(zone_context);
}
