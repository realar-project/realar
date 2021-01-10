# Realar

[![npm version](https://img.shields.io/npm/v/realar?style=flat-square)](https://www.npmjs.com/package/realar) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/realar?style=flat-square)](https://bundlephobia.com/result?p=realar) [![code coverage](https://img.shields.io/coveralls/github/betula/realar?style=flat-square)](https://coveralls.io/github/betula/realar) [![typescript supported](https://img.shields.io/npm/types/typescript?style=flat-square)](./src/index.ts)

Reactive state manager for React based on [reactive-box](https://github.com/betula/reactive-box).

[Light](https://bundlephobia.com/result?p=realar), [Fast](https://github.com/betula/reactive-box-performance), and Pretty looked :kissing_heart:

Realar targeted to clean code, minimal abstraction, minimal additional functions, modulable architecture, and time of delivery user experience.

Start!

You can start development with knows only two functions:

`box`. Reactive value marker. Each reactive value has an immutable state. If the immutable state will update, all React components that depend on It will refresh.

`shared`. One of the primary reasons for using state manager in your application is a shared state accessing, and using shared logic between scattered React components and any place of your code.

### Usage

```javascript
import React from 'react';
import { box, shared } from 'realar';

class Counter {
  @box value = 0;

  inc = () => this.value += 1;
  dec = () => this.value -= 1;
}

const sharedCounter = () => shared(Counter);

const Count = () => {
  const { value } = sharedCounter();
  return <p>{value}</p>;
};

const Buttons = () => {
  const { inc, dec } = sharedCounter();
  return (
    <>
      <button onClick={inc}>+</button>
      <button onClick={dec}>-</button>
    </>
  );
};

const App = () => (
  <>
    <Count />
    <Buttons />
    <Count />
    <Buttons />
  </>
);

export default App;
```

For best possibilities use [realar babel plugin](https://github.com/betula/babel-plugin-realar), your code will be so beautiful to look like.

But otherwise necessary to wrap all React function components that use reactive values inside to `observe` wrapper. [See wrapped version on CodeSandbox](https://codesandbox.io/s/realar-counter-k9kmw?file=/src/App.tsx).



### Demos

+ [Hello](https://github.com/realar-project/hello) - shared state demonstration.
+ [Todos](https://github.com/realar-project/todos) - todomvc implementation.
+ [Jest](https://github.com/realar-project/jest) - unit test example.

### Installation

```bash
npm install realar
# or
yarn add realar
```

And update your babel config for support decorators and using [babel plugin](https://github.com/betula/babel-plugin-realar) for automatic observation arrow function components.

```javascript
//.babelrc
{
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    ["realar", {
      "include": [
        "src/components/*",
        "src/pages/*"
      ]
    }]
  ]
}
```

Enjoy and happy coding!

