import { entry_start, entry_finish } from "./box";

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
  unlink_notify = new Map(),
  mem_leak_tick_id = 0;

export {
  link,
  unlink,
  link_dec_counter,
  link_check,
  link_scope,
  link_scope_start,
  link_scope_finish,
  link_scope_create,
  mem_leak_free,
  unlink_map_exclude,
  unlink_array_exclude,
  unlink_fn
}

function link_seq_next() {
  return ++link_seq_current;
}

function link_scope(item) {
  const id = link_scope_create(item);
  link_scope_start(id);
  return id;
}

function link_scope_create(item) {
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

function link(item) {
  const id = items_map.get(item);
  const counter = (link_counter.get(id) || 0) + 1;
  link_counter.set(id, counter);
  if (scope_current_id) {
    let deps = link_deps.get(scope_current_id);
    if (!deps) {
      link_deps.set(scope_current_id, (deps = new Set()));
    }
    deps.add(id);

    let rels = link_rels.get(id);
    if (!rels) {
      link_rels.set(id, (rels = new Set()));
    }
    rels.add(scope_current_id);
  }

  // console.log("LINK", (typeof item === "object"
  //   ? item : "view"), `${id}:${counter}`, scope_current_id);

  // next_tick_print_tree();
}

function unlink(item) {
  // console.log("UNLINK");
  link_dec_counter(item);
  link_check();
}

function link_dec_counter(item) {
  const id = items_map.get(item);
  link_counter.set(id, link_counter.get(id) - 1);
  // console.log("LINK_DEC", item, id, link_counter.get(id));
}

function link_check() {
  // next_tick_print_tree();

  let ready = []
  for (const [id, c] of link_counter) {
    if (!c) {
      ready.push(id);
      link_counter.delete(id);
    }
  }

  // console.log("READY", ready);
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
        // console.log("DEPS", id, [...deps]);
        for (const d of deps) {
          const c = link_counter.get(d) - 1;
          link_counter.set(d, c);
          if (!c) next_loop.push(d);
        }
      }
      // else {
      //   console.log("DEPS", id, 0)
      // }
    }
    ready = next_loop;
  }
  while (ready.length);

  total_loop = total_loop.reverse();
  for (const id of total_loop) free(id);
  // console.log("TOTAL_LOOP", total_loop);
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
  list = unlink_notify.get(id);
  if (list) {
    entry_start();
    for (const fn of list) fn();
    entry_finish();
    unlink_notify.delete(id);
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
  let list = unlink_notify.get(scope_current_id);
  if (!list) {
    unlink_notify.set(scope_current_id, (list = []));
  }
  list.push(fn);
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
    unlink_notify);
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
