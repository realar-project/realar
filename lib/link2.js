import { core, box_entry_start, box_entry_finish, box_collection_free, box_free } from "./core";

let
  link_seq_current = 0,
  items_map = new Map(),
  items_map_inverse = new Map(),
  link_counter = new Map(),
  link_deps = new Map(),
  link_rels = new Map(),
  mem_leak_check = new Set(),
  scope_current_id = 0,
  scope_stack = [],
  unlink_map_exludes = new Map(),
  unlink_array_exludes = new Map(),
  unlink_fns = new Map(),
  unlink_box_collections = new Map(),
  unlink_boxs = new Map(),
  mem_leak_tick_id = 0;

export {
  link,
  link_scope,
  link_scope_start,
  link_scope_finish,
  unlink,

  mem_leak_free,

  unlink_map_exclude,
  unlink_array_exclude,
  unlink_fn,
  unlink_box_collection_free,
  unlink_box_free
}

function link_seq_next() {
  return ++link_seq_current;
}

function link_scope(item) {
  const id = link_seq_next();
  items_map.set(item, id);
  items_map_inverse.set(id, item);
  mem_leak_check.add(id);
  if (!mem_leak_tick_id) mem_leak_tick();
  return id;
}

function link_scope_start(id) {
  scope_stack.push(scope_current_id);
  scope_current_id = id;
}

function link_scope_finish() {
  scope_current_id = scope_stack.pop();
}

function link(item, scope_id) {
  const id = items_map.get(item);
  const counter = (link_counter.get(id) || 0) + 1;
  link_counter.set(id, counter);

  if (arguments.length === 1) {
    scope_id = scope_current_id;
  }

  if (scope_id) {
    let deps = link_deps.get(scope_id);
    if (!deps) {
      link_deps.set(scope_id, (deps = new Set()));
    }
    deps.add(id);

    let rels = link_rels.get(id);
    if (!rels) {
      link_rels.set(id, (rels = new Set()));
    }
    rels.add(scope_id);
  }
  return id;
}

function unlink(id) {
  link_counter.set(id, link_counter.get(id) - 1);
  link_check();
}

function link_check() {
  let ready = []
  for (const [id, c] of link_counter) {
    if (!c) {
      ready.push(id);
      link_counter.delete(id);
    }
  }

  if (!ready.length) return;

  let
    total_loop = [],
    next_loop;

  do {
    total_loop.push.apply(total_loop, ready);
    next_loop = [];

    for (const id of ready) {
      const deps = link_deps.get(id);
      if (deps) {
        for (const d of deps) {
          const c = link_counter.get(d) - 1;
          link_counter.set(d, c);
          if (!c) next_loop.push(d);
        }
      }
    }
    ready = next_loop;
  }
  while (ready.length);

  total_loop = total_loop.reverse();
  for (const id of total_loop) free(id);
}

function free(id) {
  // console.log("FREE", id);
  items_map.delete(items_map_inverse.get(id));
  items_map_inverse.delete(id);
  link_counter.delete(id);

  const deps = link_deps.get(id);
  if (deps) {
    for (const d of deps) {
      let rels = link_rels.get(d);
      rels.delete(id);
      if (!rels.size) {
        link_rels.delete(d);
      }
    }
  }

  link_deps.delete(id);

  let list = unlink_map_exludes.get(id);
  if (list) {
    for (const [map, k] of list) map.delete(k);
    unlink_map_exludes.delete(id);
  }
  list = unlink_array_exludes.get(id);
  if (list) {
    for (const [arr, val] of list) {
      arr.splice(arr.indexOf(val), 1);
    }
    unlink_array_exludes.delete(id);
  }
  list = unlink_fns.get(id);
  if (list) {
    core[box_entry_start]();
    for (const fn of list) fn();
    core[box_entry_finish]();
    unlink_fns.delete(id);
  }
  list = unlink_box_collections.get(id);
  if (list) {
    for (const id of list) {
      core[box_collection_free](id);
    };
    unlink_box_collections.delete(id);
  }
  list = unlink_boxs.get(id);
  if (list) {
    for (const id of list) {
      core[box_free](id);
    };
    unlink_boxs.delete(id);
  }
}

function mem_leak_free() {
  for (const id of mem_leak_check) {
    free(id);
  }
}

function mem_leak_tick() {
  if (!mem_leak_tick_id) {
    mem_leak_tick_id = setTimeout(() => {
      mem_leak_tick_id = 0;

      const detected = [];
      for (const id of mem_leak_check) {
        if (!link_counter.has(id)) {
          detected.push(items_map_inverse.get(id));
        }
      }
      if (detected.length) {
        for (const item of detected) console.error("Unit without holder detected", item);
        throw new Error("Memory leak detected");
      }
      mem_leak_check.clear();
    });
  }
}

function unlink_map_exclude(map, id) {
  let excludes = unlink_map_exludes.get(scope_current_id);
  if (!excludes) {
    unlink_map_exludes.set(scope_current_id, (excludes = []));
  }
  excludes.push([map, id]);
}

function unlink_array_exclude(arr, val) {
  let excludes = unlink_array_exludes.get(scope_current_id);
  if (!excludes) {
    unlink_array_exludes.set(scope_current_id, (excludes = []));
  }
  excludes.push([arr, val]);
}

function unlink_fn(fn) {
  let list = unlink_fns.get(scope_current_id);
  if (!list) {
    unlink_fns.set(scope_current_id, (list = []));
  }
  list.push(fn);
}

function unlink_box_collection_free(collection_id) {
  let list = unlink_box_collections.get(scope_current_id);
  if (!list) {
    unlink_box_collections.set(scope_current_id, (list = []));
  }
  list.push(collection_id);
}

function unlink_box_free(box_id) {
  let list = unlink_boxs.get(scope_current_id);
  if (!list) {
    unlink_boxs.set(scope_current_id, (list = []));
  }
  list.push(box_id);
}

// Debug
let
  next_tick_print_tree_tid = 0;

function print_tree(next_tick) {
  const line = [];
  for (const [id, c] of link_counter) {
    let deps = link_deps.get(id) || [];
    deps = [...deps].map(d => d + ':' + link_counter.get(d));
    line.push(`${id}:${c}`, deps);
  }
  line.push("<>");
  for (const [id, c] of link_counter) {
    let rels = link_rels.get(id) || [];
    rels = [...rels].map(d => d + ':' + link_counter.get(d));
    line.push(`${id}:${c}`, rels);
  }
  line.push("!", [...mem_leak_check]);
  console.log(">", ...line, "<",
    unlink_map_exludes.size,
    unlink_array_exludes.size,
    unlink_fns,
    unlink_box_collections);
  if (!next_tick) next_tick_print_tree();
}

function next_tick_print_tree() {
  if (!next_tick_print_tree_tid) {
    next_tick_print_tree_tid = setTimeout(() => {
      next_tick_print_tree_tid = 0;
      console.log("+++");
      print_tree(1);
    });
  }
}
// End debug
