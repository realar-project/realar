# Realar <sup><sup><small><small>βeta</small></small></sup></sup>

[![npm version](https://img.shields.io/npm/v/realar?style=flat-square)](https://www.npmjs.com/package/realar) [![typescript support](https://img.shields.io/npm/types/typescript?style=flat-square)](./lib/types/typescript.d.ts) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/realar?style=flat-square)](https://bundlephobia.com/result?p=realar)

Reactive state manager for React.

Imperative, Light and Pretty looked :kissing_heart:

### Usage

```javascript
import React from "react";
import { unit, useOwn } from "realar";
import axios from "axios";

const Todos = unit({
  todos: [],
  async fetch() {
    const { data } = await axios.get("/api/todos");
    this.todos = data;
  },
  constructor() {
    this.fetch();
  },
  // get completed() {
  //   return this.todos.filter(task => task.completed);
  // },
});

const App = () => {
  const { todos, fetch } = useOwn(Todos);

  if (fetch.pending) {
    return (
      <div>Loading</div>
    )
  }
  return (
    <ul>{todos.map((todo) => <li>{todo.text}</li>)}</ul>
  );
};
```


### Documentation

+ [Realar understanding](./docs/undestanding/index.md)


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


### Demo

```bash
git clone git@github.com:betula/realar.git
cd realar
npm run start
# Open http://localhost:1210 in your browser
