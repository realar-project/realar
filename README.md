# Realar

[![npm version](https://img.shields.io/npm/v/realar?style=flat-square)](https://www.npmjs.com/package/realar) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/realar?style=flat-square)](https://bundlephobia.com/result?p=realar) [![code coverage](https://img.shields.io/coveralls/github/betula/realar?style=flat-square)](https://coveralls.io/github/betula/realar) [![typescript supported](https://img.shields.io/npm/types/typescript?style=flat-square)](./src/index.ts)

Reactive state manager for React based on [reactive-box](https://github.com/betula/reactive-box).

[Light](https://bundlephobia.com/result?p=realar), [Fast](https://github.com/betula/reactive-box-performance), and Pretty looked :kissing_heart:

Realar targeted to clean code, minimal abstraction, minimal additional functions, modulable architecture, and time of delivery user experience.

Realar supported two kinds of data and logic definitions.

You can start development in [OOP](https://en.wikipedia.org/wiki/Object-oriented_programming) style with knows only two functions:

`prop`. Reactive value marker. Each reactive value has an immutable state. If the immutable state will update, all React components that depend on It will refresh.

`shared`. One of the primary reasons for using state manager in your application is a shared state accessing, and using shared logic between scattered React components and any place of your code.

### Usage

```javascript
import React from 'react';
import { prop, shared } from 'realar';

class Counter {
  @prop value = 0;

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

### Documentation

**box**

The first abstraction of Realar is reactive container - `box`.
The `box` is a place where your store some data as an immutable struct.
When you change box value (rewrite to a new immutable struct) all who depend on It will be updated synchronously.

For create new box we need `box` function from `realar`, and initial value that will store in reactive container.
The call of `box` function returns array of two functions.
- The first is value getter.
- The second one is necessary for save new value to reactive container.

```javascript
const [get, set] = box(0);

set(get() + 1);

console.log(get()); // 1
```
[Edit on RunKit](https://runkit.com/betula/6013af7649e8720019c9cf2a)

In that example
- for a first we created `box` container for number with initial zero;
- After that, we got the box value, and set to box its value plus one;
- Let's print the result to the developer console, that will is one.

We learned how to create a box, set, and get its value.

**on**

The next basic abstraction is expression.
Expression is a function that read reactive boxes or selectors. It can return value and write reactive boxes inside.

We can subscribe to change any reactive expression using `on` function.

```javascript
const [get, set] = box(0);

const next = () => get() + 1;

on(next, (val, prev) => console.log(val, prev));

set(5); // We will see 6, 1 in developer console output, It are new and previous value
```
[Edit on RunKit](https://runkit.com/betula/6013ea214e0cf9001ac18e71)

In that example expression is `next` function, because It get box value and return that plus one.

_Documentation not ready yet for `action`, `sel`, `shared`, `sync`, `cycle`, `effect`, `initial`, `mock`, `unmock`, `free`, `useLocal`, `useValue`, `useShared`, `observe`, `transaction`, `cache` functions. It's coming soon._

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

And (if you like OOP) update your babel config for support decorators and using [babel plugin](https://github.com/betula/babel-plugin-realar) for automatic observation arrow function components.

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

