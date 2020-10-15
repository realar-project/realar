import { core, fns, box_value_create, box_value_get_phase, box_value_set_phase, box_collection_start, box_collection_finish } from "./core";
import { link, link_scope_create, link_scope_start, link_scope_finish, unlink_fn, unlink, unlink_box_collection_free, unlink_map_exclude, get_current_link_scope_id } from "./link";
import { get_mock } from "./test";
import { view_render_start, view_render_finish } from "./view";

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
unit.v = [view_render_start, view_render_finish];
unit.b = box_create;

export {
  is_schema_phase,
  unit_methods_key,
  unit_inst_key,
  unit
}

function is_schema_phase() {
  return schema_phase_deep;
}

function unit_link(inst) {
  let inst_id = link(inst, 0);
  return () => unlink(inst_id);
}

function box_create(val, link_scope_id) {
  let box_id = core[box_value_create]();
  let link_id = 0;

  if (val && val[unit_inst_key]) link_id = link(val);

  if (!link_scope_id) {
    link_scope_id = get_current_link_scope_id();
  }

  return {
    get: () => (core[box_value_get_phase](box_id), val),
    set: (v) => {
      if (Object.is(val, v)) return;
      if (link_id) link_id = unlink(link_id), 0;
      val = v;
      if (v && v[unit_inst_key]) link_id = link(v, link_scope_id);
      core[box_value_set_phase](box_id);
    }
  };
}

let unit_inst_proto = {
  [unit_inst_key]: true,
  constructor() {
    throw new Error("Manual call of unit constructor unsupported");
  },
  destructor() {
    throw new Error("Manual call of unit destructor unsupported");
  },
  expression() {
    throw new Error("Manual call of unit expression unsupported");
  }
};

function unit(_schema) {
  let
    a = arguments,
    make = a[0],
    values = a[1],
    computeds = a[2],
    methods = a[3]
  ;

  if (a.length !== 5) {
    throw new Error("Invalid `unit` call. Please check your babel config.");
  }

  function factory() {
    const mock = get_mock(factory);
    if (mock) return mock.apply(this, arguments);

    let ctx = Object.create(unit_inst_proto);
    let link_scope_id = link_scope_create(ctx);
    link_scope_start(link_scope_id);

    core[box_collection_start]();
    ++ schema_phase_deep;
    let raw = make.call(ctx);
    -- schema_phase_deep;
    let collection_id = core[box_collection_finish]();

    unlink_box_collection_free(collection_id);

    let i = key_first_property;
    for (let name of values) {
      Object.defineProperty(ctx, name, box_create(raw[i++], link_scope_id));
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

    if (raw[key_constructor]) { /* constructor */
      raw[key_constructor].apply(ctx, arguments);
    }
    if (raw[key_destructor]) { /* destructor */
      unlink_fn(raw[key_destructor]);
    }
    if (raw[key_expression_id]) { /* expression */
      unlink_map_exclude(fns, raw[key_expression_id]);
      raw[key_expression_fn]();
    }
    link_scope_finish();
    return ctx;
  }

  factory[unit_methods_key] = methods;
  return factory;
}
