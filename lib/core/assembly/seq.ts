let
  seq_slice_stack: i32[],
  seq_current: i32;

export {
  seq_init,
  seq_next,

  seq_slice_push,
  seq_slice_pop
}

@inline
function seq_init(): void {
  seq_slice_stack = [];
  seq_slice_init();
}

@inline
function seq_slice_init(): void {
  seq_current = 0;
}

@inline
function seq_slice_push(): void {
  seq_slice_stack.push(seq_current);
  seq_slice_init();
}

@inline
function seq_slice_pop(): void {
  seq_current = seq_slice_stack.pop();
}

@inline
function seq_next(): i32 {
  return ++seq_current;
}
