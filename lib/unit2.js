import { core, fns, box_value_create, box_value_get_phase, box_value_set_phase, box_collection_start, box_collection_finish } from "./core";
import { event_key, event_listen } from "./event2";
import { signal_key, signal_listen } from "./signal2";
import { call_key, call_listen } from "./call2";
import { link, link_scope, unlink_fn, unlink, unlink_box_collection_free, unlink_map_exclude } from "./link2";
import { get_mock } from "./test";

const
  unit_methods_key = Symbol(),
  unit_inst_key = Symbol(),
  key_constructor = 0,
  key_destructor = 1,
  key_expression_id = 2,
  key_expression_fn = 3,
  key_first_property = 4;

let
  schema_phase_deep = 0;

unit.c = core;
unit.f = fns;
unit.link = unit_link;

export {
  is_schema_phase,
  unit_methods_key,
  unit_inst_key,
  unit as unit2
}

function is_schema_phase() {
  return schema_phase_deep;
}

function unit_link(inst) {
  let inst_id = link(0, inst);
  return () => unlink(inst_id);
}

function unit(_schema) {
  let
    a = arguments,
    make = a[0],
    values = a[1],
    computeds = a[2],
    methods = a[3],
    actions = a[4]
  ;

  function factory() {
    const mock = get_mock(factory);
    if (mock) return mock.apply(this, arguments);

    let ctx = {
      [unit_inst_key]: true
    };
    let link_scope_id = link_scope(ctx);

    core[box_collection_start]();
    ++ schema_phase_deep;
    let raw = make.call(ctx);
    -- schema_phase_deep;
    let collection_id = core[box_collection_finish]();

    unlink_box_collection_free(link_scope_id, collection_id);

    let i = key_first_property;
    for (let name of values) {
      let val = raw[i++];
      let id = core[box_value_create]();
      let link_id = 0;

      if (val && val[unit_inst_key]) link_id = link(link_scope_id, val);

      Object.defineProperty(ctx, name, {
        get: () => (core[box_value_get_phase](id), val),
        set: (v) => {
          if (Object.is(val, v)) return;
          if (link_id) link_id = unlink(link_id), 0;
          val = v;
          if (v && v[unit_inst_key]) link_id = link(link_scope_id, v);
          core[box_value_set_phase](id);
        }
      });
    }

    for (let name of computeds) {
      Object.defineProperty(ctx, name, {
        get: raw[i++]
      });
    }
    for (let name of methods) {
      Object.defineProperty(ctx, name, {
        value: raw[i++]
      });
    }
    for (let action of actions) {
      const fn = raw[i++];
      if (action[event_key]) {
        event_listen(link_scope_id, action[event_key], fn);
      }
      else if (action[signal_key]) {
        signal_listen(link_scope_id, action[signal_key], fn);
      }
      else if (action[call_key]) {
        call_listen(link_scope_id, action[call_key], fn);
      }
    }

    if (raw[key_constructor]) { /* constructor */
      raw[key_constructor].apply(ctx, arguments);
    }
    if (raw[key_destructor]) { /* destructor */
      unlink_fn(link_scope_id, row[key_destructor]);
    }
    if (raw[key_expression_id]) { /* expression */
      unlink_map_exclude(link_scope_id, fns, raw[key_expression_id]);
      raw[key_expression_fn]();
    }

    return ctx;
  }
  factory[unit_methods_key] = methods;
  return factory;
}
