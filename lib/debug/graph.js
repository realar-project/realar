let
  next_tick_print_graph_tid = 0;

export {
  print_graph,
  next_tick_print_graph
}

function print_graph(next_tick) {
  const line = [];
  // for (const [x, deps] of box_deps) {
  //   line.push(x, box_deps.size, [...deps]);
  // }
  // line.push("<>");
  // for (const [x, rels] of box_rels) {
  //   line.push(x, box_rels.size, [...rels]);
  // }
  // line.push("!", [...box_invalid], box_expr.size, box_notify.size);
  console.log(">", ...line, "<");
  if (!next_tick) next_tick_print_graph();
};

function next_tick_print_graph() {
  if (!next_tick_print_graph_tid) {
    next_tick_print_graph_tid = setTimeout(() => {
      next_tick_print_graph_tid = 0;
      console.log("+++");
      print_graph(1);
    });
  }
}
