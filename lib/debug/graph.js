import { get_box_deps, get_box_rels, get_box_invalid, get_box_expr, map_extract, map_size, set_extract } from "../core/debug";

let
  next_tick_print_graph_tid = 0;

export {
  print_graph,
  next_tick_print_graph
}

function print_graph(next_tick) {
  const line = [];
  line.push(">");
  const box_deps = map_extract(get_box_deps());
  line.push(box_deps.length);
  for (const dep of box_deps) {
    const deps = dep[1];
    dep[1] = set_extract(deps).join(",");
  }
  line.push(box_deps.map(p => p.join(":")));
  line.push("<>");
  const box_rels = map_extract(get_box_rels());
  line.push(box_rels.length);
  for (const rel of box_rels) {
    const rels = rel[1];
    rel[1] = set_extract(rels).join(",");
  }
  line.push(box_rels.map(p => p.join(":")));
  line.push("!", set_extract(get_box_invalid()));
  line.push("E", set_extract(get_box_expr()));
  line.push("<");
  console.log(...line);
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
