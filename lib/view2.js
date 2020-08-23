import { core, fns, box_expr_create } from "./core";
import { link, link_scope, unlink } from "./link2";
import { useEffect, useReducer, useRef } from "./renderer";
import { get_service } from "./service";
import { useZone, zone_start, zone_finish } from "./zone";

let
  view_data = new Map(),
  slice_scope_id = 0,
  slice_op_index = 0,
  slice_stack = [],
  const_empty_arr = [];

export {
  view_start,
  view_finish,
  view_render,
  useUnit,
  useService
}

function view_start(id) {
  slice_stack.push([slice_scope_id, slice_op_index]);
  slice_op_index = 0;
  slice_scope_id = id;
}

function view_finish() {
  [slice_scope_id, slice_op_index] = slice_stack.pop();
}

function view_sync_reducer(step) {
  return (step + 1) % 0xffffff;
}

function view_render() {
  const [ render, args, ctx ] = arguments;
  const [, sync] = useReducer(view_sync_reducer, 0);

  const zone = useZone();
  zone_start(zone);

  const ref = useRef();
  if (!ref.current) {
    const scope_id = link_scope(sync);
    const link_id = link(0, sync);

    const box_id = core[box_expr_create]();
    fns.set(box_id, sync);

    unlink_map_exclude(scope_id, fns, box_id);
    unlink_box_free(scope_id, box_id);

    const unlink_effect = () => () => {
      unlink(link_id);
      view_data.delete(scope_id);
    }
    ref.current = [ scope_id, box_id, unlink_effect ];
  }
  const [ scope_id, box_id, unlink_effect ] = ref.current;

  view_start(scope_id);
  core[box_expr_start](box_id);
  const res = render.apply(ctx, args);
  core[box_expr_finish]();
  view_finish();

  zone_finish();
  useEffect(unlink_effect, const_empty_arr);
  return res;
}

function memo(factory, fn) {
  let data = view_data.get(slice_scope_id);
  if (!data) {
    view_data.set(slice_scope_id, (data = new Map()));
  }

  const op_index = ++slice_op_index;

  if (data.has(op_index)) {
    return data.get(op_index);
  } else {
    const inst = fn ? fn(factory) : factory();
    link(slice_scope_id, inst);

    data.set(op_index, inst);
    return inst;
  }
}

function useUnit(factory) {
  if (!slice_scope_id)
    throw new Error("Unsupported useUnit outside render function");
  return memo(factory);
}

function useService(factory) {
  if (!slice_scope_id)
    throw new Error("Unsupported useService outside render function");
  return memo(factory, get_service);
}
