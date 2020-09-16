import React from "react";
import { unit, useUnit } from "../build";

interface Item {
  title: string,
  completed?: boolean
}

const Unit = unit({
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
  }
});

export const App = () => {
  const { todos, disabled, add, toggle} = useUnit(Unit);
  todos.map(() => 0);
  if (disabled) return;
  add("hello");
  toggle(todos[0]);
  return <div />;
};
