import { computed, entry, expr, box } from "./box";
import { Connector } from "./connector";
import { is_action_uniq, resolve_action_uniq, action_listen } from "./action";
import { is_chan_uniq, resolve_chan_uniq, chan_listen } from "./chan";

export const Meta = Symbol("meta");

const Construct = "construct";
const Destruct = "destruct";
const Synchronize = "synchronize";

const Keywords = new Set([Construct, Destruct, Synchronize]);

function clone(target) {
  // TODO: check Date, and other standart primitives
  if (target && typeof target === "object") {
    const res = {};
    for (const key of Object.keys(target)) {
      const val = target[key];
      res[key] = val && typeof val === "object" ? clone(val) : val;
    }
    return res;
  }
  return target;
}

export function unit(schema) {
  const schema_descriptors = Object.getOwnPropertyDescriptors(schema);

  return () => {
    const descriptors = {};
    const meta_keys = {};
    const meta_views = {};
    const actions = new Map();
    const chans = new Map();

    Object.keys(schema_descriptors).forEach(key => {
      if (Keywords.has(key)) return;
      const { value, get, set } = schema_descriptors[key];

      if (is_action_uniq(key)) {
        const id = resolve_action_uniq(key);
        actions.set(id, value);
        return;
      }
      if (is_chan_uniq(key)) {
        const id = resolve_chan_uniq(key);
        chans.set(id, value);
        return;
      }

      let descriptor = {};
      if (typeof value === "function") {
        if (value[Connector]) {
          const connector = value();
          if (connector.get) {
            descriptor.get = connector.get;
            meta_keys[key] = "get";
          }
          if (connector.set) descriptor.set = connector.set;
          if (connector.value) {
            descriptor.value = value;
            if (typeof value === "function") {
              meta_keys[key] = "call";
            }
          }
          if (connector.view) {
            meta_views[key] = connector.view;
            meta_keys[key] = "view";
          }
        } else {
          descriptor.value = value;
          meta_keys[key] = "call";
        }
      } else if (get || set) {
        if (get) {
          descriptor.get = computed(get);
          meta_keys[key] = "get";
        }
        if (set) descriptor.set = set;
      } else {
        descriptor = box(clone(value));
        meta_keys[key] = "get";
      }
      descriptors[key] = descriptor;
    });

    let construct =
      schema_descriptors[Construct] && schema_descriptors[Construct].value;
    if (construct) construct = entry(construct);

    let syncronize =
      schema_descriptors[Synchronize] && schema_descriptors[Synchronize].value;
    if (syncronize) syncronize = expr(syncronize);

    const meta = [meta_keys, meta_views];
    const target = Object.freeze(
      Object.defineProperties({ [Meta]: meta }, descriptors)
    );
    if (construct) construct.apply(target, arguments);

    for (const [id, fn] of actions) action_listen(id, entry(fn).bind(target));
    for (const [id, fn] of chans) chan_listen(id, entry(fn).bind(target));

    if (syncronize) syncronize.apply(target);
    return target;
  };
}
