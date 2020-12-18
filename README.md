# Realar

[![npm version](https://img.shields.io/npm/v/realar?style=flat-square)](https://www.npmjs.com/package/realar) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/realar@0.3.0?style=flat-square)](https://bundlephobia.com/result?p=realar@0.3.0) [![code coverage](https://img.shields.io/coveralls/github/betula/realar?style=flat-square)](https://coveralls.io/github/betula/realar) [![typescript supported](https://img.shields.io/npm/types/typescript?style=flat-square)](./src/index.ts)

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

And update your babel config if your want to use [babel-plugin](https://github.com/betula/babel-plugin-realar) for automatic decorated arrow function components.

Enjoy and happy coding!

