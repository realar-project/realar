import { core, fns, box_value_create, box_value_get_phase, box_value_set_phase, box_collection_start, box_collection_finish } from "./core";
import { event_key } from "./event2";
import { link, link_scope, unlink_fn, unlink, unlink_box_collection_free } from "./link2";
import { get_mock } from "./test";

const
  unit_methods_key = Symbol(),
  unit_inst_key = Symbol(),
  key_constructor = 0,
  key_destructor = 1,
  key_expression = 2;

unit2.c = core;
unit2.f = fns;

export {
  unit_methods_key,
  unit_inst_key,
  unit2
}

function unit2(_schema) {
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

    let ctx = {};
    let link_scope_id = link_scope(ctx);

    core[box_collection_start]();
    let raw = make.call(ctx);
    let collection_id = core[box_collection_finish]();

    unlink_box_collection_free(link_scope_id, collection_id);

    let i = 3;
    for (let name of values) {
      let val = raw[i++];
      let id = core[box_value_create]();
      let link_id = 0;

      if (val && val[unit_inst_key]) link_id = link(link_scope_id, v);

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
        event_listen(fn)
      }
    }

    if (raw[key_constructor]) { /* constructor */
      raw[key_constructor].apply(ctx, arguments);
    }
    if (raw[key_expression]) { /* expression */
      raw[key_expression]();
    }
    if (raw[key_destructor]) { /* destructor */
      unlink_fn(link_scope_id, row[key_destructor]);
    }

    return ctx;
  }
  factory[unit_methods_key] = methods;
  return factory;
}
