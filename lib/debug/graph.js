import { get_box_deps, get_box_rels, get_box_invalid, get_box_expr, map_extract, map_size, set_extract } from "../core/debug";

let
  next_tick_print_graph_tid = 0;

export {
  print_graph,
  next_tick_print_graph
}

function print_graph(next_tick) {
  const line = [];
  const box_deps = map_extract(get_box_deps());
  for (const [x, deps] of box_deps) {
    line.push(x, map_size(box_deps), set_extract(deps));
  }
  line.push("<>");
  const box_rels = map_extract(get_box_rels());
  for (const [x, rels] of box_rels) {
    line.push(x, map_size(box_rels), set_extract(rels));
  }
  line.push("!", set_extract(get_box_invalid()));
  line.push("E", set_extract(get_box_expr()));
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
