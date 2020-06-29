import { is_action_uniq, resolve_action_uniq, action_listen } from "./action";
import { computed, expr, box, entry_start, entry_finish } from "./box";
import { is_call_uniq, resolve_call_uniq, call_listen } from "./call";
import { is_connector, connector } from "./connector";
import { link, link_scope, link_scope_finish, unlink_fn } from "./link";
import { get_mock } from "./mock";
import { schema_phase_start, schema_phase_finish, is_schema_phase } from "./schema";
import { is_signal_uniq, resolve_signal_uniq, signal_listen } from "./signal";

const
  construct_key = "construct",
  destruct_key = "destruct",
  synchronize_key = "synchronize",
  keyword_keys = new Set([construct_key, destruct_key, synchronize_key]),
  meta_key = Symbol("meta");

export {
  unit,
  get_unit_factory_meta
}

function unit(schema) {
  return function factory() {
    if (is_schema_phase()) {
      const schema_arguments = arguments;
      return connector(function() {
        const inst = factory.apply(null, schema_arguments);
        link(inst);
        return {
          get: () => inst
        }
      });
    }
    const mock = get_mock(factory);
    if (mock) return mock.apply(this, arguments);

    const inst = {};
    const descriptors = {};
    const actions = new Map();
    const calls = new Map();
    const signals = new Map();
    const meta_methods = [];

    link_scope(inst);

    let invoked_schema = schema;
    schema_phase_start();
    while (typeof invoked_schema === "function") {
      invoked_schema = invoked_schema.call(inst);
    }
    schema_phase_finish();

    const schema_descriptors = Object.getOwnPropertyDescriptors(invoked_schema);

    Object.keys(schema_descriptors).forEach(key => {
      if (keyword_keys.has(key)) return;
      const { value, get, set } = schema_descriptors[key];

      if (is_action_uniq(key)) {
        const id = resolve_action_uniq(key);
        actions.set(id, value);
        return;
      }
      else if (is_call_uniq(key)) {
        const id = resolve_call_uniq(key);
        calls.set(id, value);
        return;
      }
      else if (is_signal_uniq(key)) {
        const id = resolve_signal_uniq(key);
        signals.set(id, value);
        return;
      }

      let descriptor = {};
      if (typeof value === "function") {
        if (is_connector(value)) {
          descriptor = value.call(inst);
        } else {
          descriptor.value = value.bind(inst);
          meta_methods.push(key);
        }
      } else if (get || set) {
        if (get) descriptor.get = computed(get)
        if (set) descriptor.set = set;
      } else {
        descriptor = box(value);
      }
      descriptors[key] = descriptor;
    });

    factory[meta_key] = [meta_methods];

    let construct = schema_descriptors[construct_key] && schema_descriptors[construct_key].value;
    if (construct) {
      const fn = construct;
      construct = function() {
        entry_start();
        const res = fn.apply(this, arguments);
        entry_finish();
        return res;
      }
    }

    let syncronize = schema_descriptors[synchronize_key] && schema_descriptors[synchronize_key].value;
    if (syncronize) syncronize = expr(syncronize);

    let destruct = schema_descriptors[destruct_key] && schema_descriptors[destruct_key].value;
    if (destruct) unlink_fn(destruct.bind(inst));

    Object.defineProperties(inst, descriptors);
    if (construct) construct.apply(inst, arguments);

    for (const [id, fn] of actions) action_listen(id, fn.bind(inst));
    for (const [id, fn] of calls) call_listen(id, fn.bind(inst));
    for (const [id, fn] of signals) signal_listen(id, fn.bind(inst));

    if (syncronize) syncronize.apply(inst);

    link_scope_finish();
    return inst;
  };
}

function get_unit_factory_meta(val) {
  return val[meta_key];
}

