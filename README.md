# Realar

[![npm version](https://img.shields.io/npm/v/realar?style=flat-square)](https://www.npmjs.com/package/realar) [![typescript support](https://img.shields.io/npm/types/typescript?style=flat-square)](./docs/typescript.md) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/realar?style=flat-square)](https://bundlephobia.com/result?p=realar)

Reactive state manager for React.

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


### Slides

+ [Realar understanding](https://docs.google.com/presentation/d/1kEORchNg8AKYjl294nw_4aA6C5EINpXNkO-aevkZelw/edit?usp=sharing)


### Installation

```bash
npm i -P realar
# or
yarn add realar
```

Update your babel config:

```javascript
// .babelrc.js
module.exports = {
  "plugins": [
    "realar/babel"
  ]
}
```

And to wrap your `react-dom` render code, to realar `ready` function:

```javascript
import React from "react";
import { render } from "react-dom";
import { ready } from "realar";
import { App } from "./app";

ready(() => render(<App />, document.getElementById("root")));
```

Enjoy!


### Demo

```bash
git clone git@github.com:betula/realar.git
cd realar
npm run start
# Open http://localhost:1210 in your browser
