


function box_collection_start(): void {
  box_collection_stack.push(box_collection_ids!);
  box_collection_ids = [];
}

function box_collection_finish(): i32 {
  box_collection_ids = box_collection_stack.pop();

  // TODO:
  return 0
}

function box_collection_free(): void {
  // TODO:
}
