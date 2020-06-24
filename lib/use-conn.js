import { useRef, useEffect, useReducer } from "react";
import { useZone, zone_start, zone_finish } from "./zone";

const syncReducer = step => (step + 1) % 0xffffff;

export function useConn(Unit, conn) {
  const [, sync] = useReducer(syncReducer, 0);
  const zone = useZone();
  const ref = useRef();
  if (!ref.current) {
    zone_start(zone);
    ref.current = conn(Unit, sync);
    zone_finish();
  }
  const { unlink, render, inst } = ref.current;

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => unlink, []);
  render();
  return inst;
}
