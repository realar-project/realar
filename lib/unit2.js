import { core, fns, box_value_create, box_value_get_phase, box_value_set_phase } from "./core";
import { event_key } from "./event2";
import { link, link_scope, link_scope_finish, unlink_fn, unlink } from "./link";
import { get_mock } from "./test";

const
  unit_methods_key = Symbol(),
  unit_inst_key = Symbol()
  ;

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
    link_scope(ctx);

    let raw = make.call(ctx);
    let i = 3;
    for (let name of values) {
      let val = raw[i++];
      let id = core[box_value_create]();
      let linked = 0;

      if (val && val[unit_inst_key]) linked = link(v), 1;

      Object.defineProperty(ctx, name, {
        get: () => (core[box_value_get_phase](id), val),
        set: (v) => {
          if (Object.is(val, v)) return;
          if (linked) linked = unlink(val), 0;
          val = v;
          if (v && v[unit_inst_key]) linked = link(v), 1;
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

    if (raw[0]) { /* constructor */
      raw[0].apply(ctx, arguments);
    }
    if (raw[1]) { /* destructor */
    }
    if (raw[2]) { /* expression */
      raw[2]();
    }

    link_scope_finish();
    return ctx;
  }
  factory[unit_methods_key] = methods;
  return factory;
}
