import React from "react";
import {
  unit,
  useOwn,
  useShared,
  action,
  signal,
  call,
  shared,
  Shared,
  Scope,
  changed,
  pending,
  on,
  effect,
  ready,

  Argument,
  Result,
  Handler,
  AsyncPool
} from "../../build";

interface Item {
  title: string,
  completed?: boolean
}

const empty = action();
const doIt = action<number>();
const doIt_2 = doIt;
const shareIt = signal<string>();
const shareIt_2 = shareIt;
const callIt = call<number[][], number[]>();
const callIt_2 = callIt;

empty();
doIt(10);
shareIt("hello");
f(callIt([[4, 5]]));

function f(r: number[]) {
  return r;
}

const Router = unit({
  path: null,
});

const Unit = unit({
  service: shared(Router),

  [doIt]: (id: Argument<typeof doIt>) => {
    function f(n: number) {
      return n;
    }
    return f(id);
  },
  [doIt_2]: function() {} as Handler<typeof doIt_2>,

  [shareIt]: function(text: Argument<typeof shareIt>) {
    function f(s: string) {
      return s;
    }
    return f(text);
  },
  [shareIt_2]: function() {} as Handler<typeof shareIt_2>,

  [callIt](req: Argument<typeof callIt>): Result<typeof callIt> {
    function f(m: number[][]) {
      return m[0];
    }
    return f(req);
  },
  [callIt_2]: function(arg) {
    function f(m: number[][]) {
      return m[0];
    }
    return f(arg);
  } as Handler<typeof callIt_2>,


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

    on(doIt, (n) => n.toFixed());
    on(shareIt, (s) => s.charCodeAt(0));
    on(callIt, (matrix) => matrix[0][0].toFixed());
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


ready((n, s) => {
  return n.toFixed() + s.charAt(0);
}, 10, "hello");

ready(() => {});

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
    <Scope>
      <Shared unit={Unit} />
      <Shared unit={Router} />
    </Scope>
  );
};
