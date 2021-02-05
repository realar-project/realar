# Realar

[![npm version](https://img.shields.io/npm/v/realar?style=flat-square)](https://www.npmjs.com/package/realar) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/realar?style=flat-square)](https://bundlephobia.com/result?p=realar) [![code coverage](https://img.shields.io/coveralls/github/betula/realar?style=flat-square)](https://coveralls.io/github/betula/realar) [![typescript supported](https://img.shields.io/npm/types/typescript?style=flat-square)](./src/index.ts)

**Multiparadigm** state manager for React based on [reactive mathematic](https://github.com/betula/reactive-box).

[Light](https://bundlephobia.com/result?p=realar), [Fast](https://github.com/betula/reactive-box-performance), and Pretty looked :kissing_heart:

Realar targeted to clean code, modulable architecture, and time of delivery user experience.

Supported **two kinds** of data and logic definitions.

- Plain functional reactive programming with only functions

```javascript
const [getCount, set] = box(0);

const tick = () => set(getCount() + 1);
setInterval(tick, 200);

const App = () => {
  const count = useValue(getCount);
  return (
    <p>{count}</p>
  )
}
```
[Try on CodeSandbox](https://codesandbox.io/s/realar-ticker-functional-6s3mx?file=/src/App.tsx)

- And transparent functional reactive programming with classes, decorators and [jsx wrapper](https://github.com/betula/babel-plugin-realar)

```javascript
class Ticker {
  @prop count = 0
  tick = () => ++this.count;
}

const ticker = new Ticker();
setInterval(ticker.tick, 200);

const App = () => (
  <p>{ticker.count}</p>
)
```
[Try wrapped version on CodeSandbox](https://codesandbox.io/s/realar-ticker-classes-c9819?file=/src/App.tsx)

Realar **targeted to** all scale applications up to complex enterprise solutions on microfrontends architecture.

You can use as many from Realar as you want. For small websites or theme switchers, two functions are enough:ok_hand: Step by step on applications scale stairs you can take more and more. From sharing state to all application parts, to modulable architecture with apps composition.

### Abstraction

The abstraction of the core is an implementation of functional reactive programming on javascript and binding that with React.

It uses usual mathematic to describe dependencies and commutation between reactive values.

In contradistinction to _stream pattern_, operator functions not needed. The reactive “sum” operator used a simple “+” operator (for example).

```javascript
const [getA, setA] = box(0)
const [getB, setB] = box(0)

const sum = () => getA() + getB()

on(sum, console.log)
```

That code has a graph of dependencies inside. “sum” - reactive expression depends from “A” and “B”, and will react if “A” or “B” changed. It is perfectly demonstrated with “on” function (that subscribes to reactive expression) and “console.log” (developer console output).

On each change of “A” or “B” a new value of that sum will appear in the developer console output.

And for tasty easy binding reactive expressions and values with React components.

```javascript
const App = () => {
  const val = useValue(sum);
  return (
    <p>{val}</p>
  );
}
```

That component will be updated every time when new sum value is coming.

The difference from exists an implementation of functional reactive programming (mobx) in Realar dependency collector provides the possibility to write in selectors and nested writable reactions.

Realar provides big possibility abstractions for reactive flow. We already know about reactive value container, reactive expressions, and subscribe mechanism. But also have synchronization between data, cycled reactions, cached selectors, and transactions.

**Below I will talk about high level abstractions** provided from Realar out of the box.

- __Shared instances decomposition__. The pattern for decomposing applications logic to separate independent or one direction dependent modules. Each module can have its own set of reactive values. (ssr, comfort “mock” mechanism for simple unit testing)


- __Actions__ are a necessary part of reactive communication, well knows for most javascript developers. Possibility for subscribing to action, call action, and wait for the next action value everywhere on the code base.


- __React components context level scopes__. Declaration one scope and use as many reactive value containers as you want no need to define a new React context for each changeable value.


- __Decorators for clasess lovers__. And babel plugin for automatic wrap all arrow functions defined in the global scope with JSX inside to observe wrapper for the total implementation of transparent functional reactive programming (TFRP) in javascript with React.

### Classes usage

If you don't have an interest in classes or decorators, you can code in [functional style](#functional-usage) with a wide and full feature API.

But if you like, it looks likes very clear and natively, and you can start development knows only two functions.

`prop`. Reactive value marker. Each reactive value has an immutable state. If the immutable state will update, all React components that depend on It will refresh.

`shared`. One of the primary reasons for using state manager in your application is a shared state accessing, and using shared logic between scattered React components and any place of your code.

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

But otherwise necessary to wrap all React function components that use reactive values inside to `observe` wrapper. [Try wrapped version on CodeSandbox](https://codesandbox.io/s/realar-counter-k9kmw?file=/src/App.tsx).

### Functional usage

```javascript
import React from "react";
import { box, useValue } from "realar";

const [get, set] = box(0);

const next = () => get() + 1;

const inc = () => set(next());
const dec = () => set(get() - 1);

const Current = () => {
  const value = useValue(get);
  return <p>current: {value}</p>;
};

const Next = () => {
  const value = useValue(next);
  return <p>next: {value}</p>;
};

const App = () => (
  <>
    <Current />
    <Next />

    <button onClick={inc}>+</button>
    <button onClick={dec}>-</button>
  </>
);

export default App;
```
[Try on CodeSandbox](https://codesandbox.io/s/realar-pure-counter-1ue4h?file=/src/App.tsx).


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

set(5); // We will see 6 and 1 in developer console output, It are new and previous value
```
[Edit on RunKit](https://runkit.com/betula/6013ea214e0cf9001ac18e71)

In that example expression is `next` function, because It get box value and return that plus one.

**cycle**

```javascript
const [get, set] = box(0);

cycle(() => {
  console.log(get() + 1);
});

set(1);
set(2);

// In output of developer console will be 1, 2 and 3.
```
[Edit on RunKit](https://runkit.com/betula/601a733c5bfc4e001a38def8)

- Takes a function as reactive expression.
- After each run: subscribe to all reactive boxes accessed while running
- Re-run on data changes

**sync**

```javascript
const [getSource, setSource] = box(0);
const [getTarget, setTarget] = box(0);

sync(getSource, setTarget);
// same as sync(() => getSource(), val => setTarget(val));

setSource(10);

console.log(getTarget()) // 10
```
[Edit on RunKit](https://runkit.com/betula/601a73b26adfe70020a0e229)

_Documentation not ready yet for `action`, `sel`, `shared`, `effect`, `initial`, `mock`, `unmock`, `free`, `useLocal`, `useValue`, `useShared`, `useScoped`, `Scope`, `observe`, `transaction`, `cache`, `prop` functions. It's coming soon._

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

**If you like OOP** update your babel config for support class decorators and using [babel plugin](https://github.com/betula/babel-plugin-realar) for automatic observation arrow function components.

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

