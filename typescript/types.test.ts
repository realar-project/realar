import { unit, useUnit } from "../build";

interface Item {
  title: string,
  completed?: boolean
}

const Unit = unit({
  todos: [] as Item[],

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
  useUnit(Unit);
  return null;
};
