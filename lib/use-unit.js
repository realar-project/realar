import { view } from "./view";
import { useConn } from "./use-conn";

const conn = (Unit, sync) => view(Unit(), sync);

export function useUnit(Unit) {
  return useConn(Unit, conn);
}
