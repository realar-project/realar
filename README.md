# Realar

[![npm version](https://img.shields.io/npm/v/realar?style=flat-square)](https://www.npmjs.com/package/realar) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/realar?style=flat-square)](https://bundlephobia.com/result?p=realar) [![code coverage](https://img.shields.io/coveralls/github/betula/realar?style=flat-square)](https://coveralls.io/github/betula/realar) [![typescript supported](https://img.shields.io/npm/types/typescript?style=flat-square)](./src/index.ts)

Reactive state manager for React based on [reactive-box](https://github.com/betula/reactive-box).

Light, Fast, and Pretty looked :kissing_heart:

### Usage

```javascript
import React from 'react';
import { box, shared } from 'realar';

class Counter {
  @box value = 0;

  increment = () => this.value += 1;
  decrement = () => this.value -= 1;
}

const sharedCounter = () => shared(Counter);

const App = () => {
  const { value, increment, decrement } = sharedCounter();
  return (
    <p>
      Counter: {value}
      <br />
      <button onClick={decrement}>Prev</button>
      <button onClick={increment}>Next</button>
    </p>
  );
};
```

If you no have possibilities for using [realar babel plugin](https://github.com/betula/babel-plugin-realar), your code will be not so beautiful look like, because otherwise necessary to wrap all React function components that use reactive values inside to `observe` wrapper.

[See wrapped version on CodeSandbox](https://codesandbox.io/s/realar-counter-k9kmw?file=/src/App.tsx).

### Demos

+ [Hello](https://github.com/realar-project/hello) - shared state demonstration.
+ [Todos](https://github.com/realar-project/todos) - todomvc implementation.
+ [Jest](https://github.com/realar-project/jest) - unit test example.

### Installation

```bash
npm install --save realar
# or
yarn add realar
```

And update your babel config if you want to use [babel plugin](https://github.com/betula/babel-plugin-realar) for automatic observation for arrow function components.

Enjoy and happy coding!

