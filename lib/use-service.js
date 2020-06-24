import { view } from "./view";
import { useConn } from "./use-conn";
import { get_service } from "./service";

const conn = (Unit, sync) => view(get_service(Unit), sync);

export function useService(Unit) {
  return useConn(Unit, conn);
}
