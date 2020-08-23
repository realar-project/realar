import { core, fns, box_expr_create } from "./core";
import { link, link_scope_create, link_scope_start, link_scope_finish, unlink } from "./link2";
import { useEffect, useReducer, useRef } from "./renderer";
import { get_service } from "./service";
import { useZone, zone_start, zone_finish } from "./zone";

let
  view_seq_current = 0,
  view_data = new Map(),
  view_unlink = new Map(),
  slice_current_id = 0,
  slice_op_index = 0,
  slice_stack = [],
  const_empty_arr = [];

export {
  view_seq_next,
  view_start,
  view_finish,
  view_render,
  useUnit,
  useService
}

function view_seq_next() {
  return ++view_seq_current;
}
function view_start(id) {
  slice_stack.push([slice_current_id, slice_op_index]);
  slice_op_index = 0;
  slice_current_id = id;
}

function view_finish() {
  [slice_current_id, slice_op_index] = slice_stack.pop();
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
    const scope_id = link_independent_scope_create(sync);


    // const id = view_create(sync);
    const box_id = core[box_expr_create]();
    fns.set(box_id, sync);

    unlink_box_free(scope_id, box_id)


    link_scope_finish();
    const body = view_block(id, render);
    const unlink_effect = () => () => unlink(sync);
    ref.current = [ body, unlink_effect, scope_id ];
  }
  const [ body, unlink_effect, scope_id ] = ref.current;
  link_scope_start(scope_id);
  // console.log("VIEW_LINK_SCOPE_START", scope_id);
  view_start(view_id);
  core[box_expr_start](expr_id);
  const res = body.apply(ctx, args);
  core[box_expr_finish]();
  view_finish();
  // console.log("VIEW_LINK_SCOPE_FINISH");
  link_scope_finish();
  zone_finish();
  useEffect(unlink_effect, const_empty_arr);
  return res;
}

function memo(factory, fn) {
  let data = view_data.get(slice_current_id);
  if (!data) {
    view_data.set(slice_current_id, (data = new Map()));
  }

  const op_index = ++slice_op_index;

  if (data.has(op_index)) {
    return data.get(op_index);
  } else {
    const inst = fn ? fn(factory) : factory();
    link_scope_link(inst);
    data.set(op_index, inst);

    let insts = view_unlink.get(slice_current_id);
    if (!insts) {
      view_unlink.set(slice_current_id, (insts = new Set()));
    }
    insts.add(inst);
    return inst;
  }
}

function useUnit(factory) {
  if (!slice_current_id)
    throw new Error("Unsupported useUnit outside render function");
  return memo(factory);
}

function useService(factory) {
  if (!slice_current_id)
    throw new Error("Unsupported useService outside render function");
  return memo(factory, get_service);
}
