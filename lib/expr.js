let
  expr_data = new Map(),
  slice_current_id = 0,
  slice_op_index = 0,
  slice_stack = [];

export {
  expr_start,
  expr_finish,
  changed
}

function expr_start(id) {
  slice_stack.push([slice_current_id, slice_op_index]);
  slice_op_index = 0;
  slice_current_id = id;
}

function expr_finish() {
  [slice_current_id, slice_op_index] = slice_stack.pop();
}

function changed(value, cmpfn) {
  if (!slice_current_id)
    throw new Error("Unsupported changed outside synchronize");

  let data = expr_data.get(slice_current_id);
  if (!data) {
    expr_data.set(slice_current_id, (data = new Map()));
  }

  const op_index = ++slice_op_index;

  let res = false;
  if (data.has(op_index)) {
    const val = data.get(op_index);
    res = !(cmpfn || Object.is)(value, val);
    if (res) data.set(op_index, value);
  } else {
    data.set(op_index, value);
  }
  return res;
}
