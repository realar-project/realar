import { core, fns } from "./core";

copy_core_api_fns(unit2, core);

const
  unit_meta_methods_key = Symbol(),
  unit_inst_key = Symbol()
  ;

export {
  unit_meta_methods_key,
  unit_inst_key,
  unit2
}

function link() {}
function unlink() {}

function unit2(_schema) {
  let
    a = arguments,
    make = a[0],
    values = a[1],
    computeds = a[2],
    methods = a[3]
  ;

  function factory() {
    let ctx = {};
    let raw = make.call(ctx);
    let i = 3;
    for (let name of values) {
      let val = raw[i++];
      let id = core.b0(); /*box_value_create*/
      let linked = 0;
      Object.defineProperty(ctx, name, {
        get: () => (core.b1(id) /*box_value_get_phase*/, val),
        set: (v) => {
          if (Object.is(val, v)) return;
          if (linked) linked = unlink(val), 0;
          val = v;
          if (v && v[unit_inst_key]) linked = link(v), 1;
          core.b2(id); /*box_value_set_phase*/
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

    if (raw[0]) { /* constructor */
      raw[0].apply(ctx, arguments);
    }
    if (raw[1]) { /* destructor */
    }
    if (raw[2]) { /* expression */
      raw[2]();
    }

    return ctx;
  }
  factory[unit_meta_methods_key] = methods;
  return factory;
}

function copy_core_api_fns(u, core) {
  for (let i = 0; i <= 9; i++) {
    u["b"+i] = core["b"+i]
  }
  let from = "a".charCodeAt(0);
  let to = "d".charCodeAt(0);
  for (let i = from; i <= to; i++) {
    let n = String.fromCharCode(i);
    u["b"+n] = core["b"+n]
  }
  u.fns = fns;
}
