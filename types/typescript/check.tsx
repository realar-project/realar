import React from "react";
import {
  unit,
  useOwn,
  useShared,
  shared,
  Shared,
  changed,
  pending,
  effect,

  AsyncPool
} from "../../build";

interface Item {
  title: string,
  completed?: boolean
}

const Router = unit({
  path: null,
});

const Unit = unit({
  service: shared(Router),

  todos: [] as Item[],
  disabled: null as boolean | null,

  add(title: string) {
    this.todos = [
      ...this.todos,
      { title }
    ];
  },
  toggle(item: Item) {
    this.todos = this.todos.map(i =>
      i === item ? { ...i, completed: !i.completed } : i
    );
  },

  async load(): Promise<boolean> {
    return pending(this.load);
  },

  constructor(initial?: Item[]) {
    this.todos = initial ?? this.todos;

    effect(() => {});
    effect(() => () => {});
  },

  expression() {
    check(changed(this.todos));
    function check(v: boolean) {
      return v;
    }
    (this.load as AsyncPool).pending || pending(this.load);
  },
});

export const App = () => {

  const instance = Unit();

  const { todos, disabled, add, toggle, load} = instance;
  if (load.pending) return;
  todos.map(() => 0);
  if (disabled) return;
  add("hello");
  toggle(todos[0]);

  useOwn(Unit).todos.map(() => 0);
  useOwn(Unit).load.pending;
  useShared(Unit).todos.map(() => 0);
  useShared(Unit).load.pending;

  return (
    <>
      <Shared unit={Unit} />
      <Shared unit={Router} />
    </>
  );
};
