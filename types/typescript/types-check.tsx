import React from "react";
import { unit, useUnit, action, signal, call, Service, Scope, changed } from "../../build";

interface Item {
  title: string,
  completed?: boolean
}

const doIt = action<[number]>();
const shareIt = signal<[string, number]>();
const callIt = call<[number, number[]], string>();

doIt(10);
shareIt("hello", 11);
f(callIt(1, [4, 5]));

function f(s: string) {
  return s;
}

const Unit = unit({
  /*
    Not found way to auto define types of handler parameters
    for action, signal and call in unit schema
  */
  [doIt]() {},
  [shareIt]() {},
  [callIt]() {},

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

  async load() {
    return this.load.pending;
  },

  constructor(initial?: Item[]) {
    this.todos = initial ?? this.todos;

    // this.expression(); // May be possible change type of this??
    // this.load.pending ??
  },

  expression() {
    check(changed(this.todos));
    function check(v: boolean) {
      return v;
    }
  }
});

export const App = () => {
  const { todos, disabled, add, toggle} = useUnit(Unit);
  todos.map(() => 0);
  if (disabled) return;
  add("hello");
  toggle(todos[0]);
  return (
    <Scope>
      <Service unit={Unit} />
    </Scope>
  );
};

