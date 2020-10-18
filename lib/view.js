import { box_expr_create, box_expr_start, box_expr_finish } from "./box";
import { link, link_scope_create, link_scope_start, link_scope_finish, unlink, unlink_box_free } from "./link";
import { useEffect, useReducer, useRef } from "./renderer";
import { get_shared } from "./shared";
import { is_test_scope_phase } from "./test";

let
  view_data = new Map(),
  view_deep = 0,
  slice_scope_id = 0,
  slice_op_index = 0,
  slice_stack = [],
  const_empty_arr = [];

export {
  view_start,
  view_finish,
  view_render_start,
  view_render_finish,
  useOwn,
  useShared
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

function view_render_start() {
  let sync;

  if (view_deep === 0) {
    try {
      sync = useReducer(view_sync_reducer, 0)[1];
    } catch (e) {
      if (String(e).indexOf("Invalid hook call") === -1) { // React error detection. TODO: Replace to renderer
        throw e;
      }
      view_start(0);
      return;
    }
    view_deep ++;
  } else {
    view_deep ++;
    return;
  }

  const ref = useRef();
  if (!ref.current) {
    const scope_id = link_scope_create(sync);
    const link_id = link(sync);
    const box_id = box_expr_create(sync);

    link_scope_start(scope_id);
    unlink_box_free(box_id);
    link_scope_finish();

    const unlink_effect = () => () => {
      unlink(link_id);
      view_data.delete(scope_id);
    }
    ref.current = [ scope_id, box_id, unlink_effect ];
  }
  const [ scope_id, box_id, unlink_effect ] = ref.current;

  useEffect(unlink_effect, const_empty_arr);

  view_start(scope_id);
  link_scope_start(scope_id);
  box_expr_start(box_id);
}

function view_render_finish() {
  if (!slice_scope_id) {
    view_finish();
    return;
  }

  view_deep --;
  if (view_deep !== 0) return;

  box_expr_finish();
  link_scope_finish();
  view_finish();
}

function memo(factory, fn, args) {
  let data = view_data.get(slice_scope_id);
  if (!data) {
    view_data.set(slice_scope_id, (data = new Map()));
  }

  const op_index = ++slice_op_index;

  if (fn) {
    if (data.has(op_index)) {
      return data.get(op_index);
    } else {
      const inst = fn(factory);
      link(inst);

      data.set(op_index, inst);
      return inst;
    }
  } else {
    args = args || [];
    if (data.has(op_index)) {
      let [inst, prev_args] = data.get(op_index);

      let changed = args.length !== prev_args.length;

      if (!changed) {
        if (args.length === 0) return inst;

        let len = args.length;
        while(len--) {
          if (!Object.is(prev_args[len], args[len])) {
            changed = 1;
            break;
          }
        }
      }
      if (!changed) {
        return inst;
      }

      if (inst) {
        unlink(inst);
      }

      inst = factory.apply(null, args);
      link(inst);

      data.set(op_index, [inst, args]);
      return inst;
    }
    else {
      const inst = factory.apply(null, args);
      link(inst);

      data.set(op_index, [inst, args]);
      return inst;
    }
  }
}

function useOwn(factory) {
  if (!slice_scope_id && !is_test_scope_phase())
    throw new Error("Unsupported useOwn outside render function");
  const args = Array.prototype.slice.call(arguments, 1);
  return memo(factory, 0, args.length ? args : 0);
}

function useShared(factory) {
  if (!slice_scope_id && !is_test_scope_phase())
    throw new Error("Unsupported useShared outside render function");
  return memo(factory, get_shared);
}
