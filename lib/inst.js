import { Connector } from "./connector";
import { view } from "./view";

export function inst(Unit) {
  const connector = () => {
    const inst = Unit();
    return {
      get: () => inst,
      view: sync => view(inst, sync)
    };
  };
  connector[Connector] = true;
  return connector;
}
