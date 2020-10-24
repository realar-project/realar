# Realar <sup><sup>βeta</sup></sup>

[![npm version](https://img.shields.io/npm/v/realar?style=flat-square)](https://www.npmjs.com/package/realar) [![typescript support](https://img.shields.io/npm/types/typescript?style=flat-square)](./lib/types/typescript.d.ts) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/realar?style=flat-square)](https://bundlephobia.com/result?p=realar) [![code coverage](https://img.shields.io/coveralls/github/betula/realar?style=flat-square)](https://coveralls.io/github/betula/realar)

Reactive state manager for React.

Light, Fast, and Pretty looked :kissing_heart:

### Usage

```javascript
import React from "react";
import axios from "axios";
import { unit, useOwn } from "realar";

const Todos = unit({
  todos: [],            // Init immutable store
  async fetch() {
    const { data } = await axios.get("/api/todos");
    this.todos = data;  // Update immutable store
  },
  constructor() {
    this.fetch();
  },
  // get completed() {  // Cached selector
  //   return this.todos.filter(task => task.completed);
  // },
});

const App = () => {
  // Use the own instance of Todos
  const { todos, fetch } = useOwn(Todos);

  if (fetch.pending) {
    return (
      <div>Loading</div>
    )
  }
  return (
    <ul>{todos.map(todo => <li>{todo.text}</li>)}</ul>
  );
};
```


### Documentation

+ [Realar understanding](./docs/undestanding/index.md)


### Demos

+ [Hello](https://github.com/realar-project/hello) - shared state demonstration.
+ [Todos](https://github.com/realar-project/todos) - todomvc implementation.


### Installation

```bash
npm i -P realar
# or
yarn add realar
```

And update your babel config:

```javascript
// .babelrc.js
module.exports = {
  "plugins": [
    "realar/babel"
  ]
}
```

Enjoy!

