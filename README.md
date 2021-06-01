# Realar

[![npm version](https://img.shields.io/npm/v/realar?style=flat-square)](https://www.npmjs.com/package/realar) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/realar?style=flat-square)](https://bundlephobia.com/result?p=realar) [![code coverage](https://img.shields.io/coveralls/github/betula/realar?style=flat-square)](https://coveralls.io/github/betula/realar) [![typescript supported](https://img.shields.io/npm/types/typescript?style=flat-square)](./src/index.ts)

The state manager to reduce developers' coding time and increase the lifetime of your codebase.

Realar targeted to all scale applications up to complex enterprise solutions on modular architecture.

- __Logic free React components__. Perfect instruments for moving all component logic outside. Your React component will be pure from any unnecessary code, only view, only JSX, no more.

- __Lightweight and Fast__. Less then 5kB. Aims at the smallest size of the resulting bundle. And only parts are updated in which is really necessary to make changes.

- __Value and Signal__ is the big elephants remind Store and Action from Redux. Allows you to perform familiar coding techniques, and also add many modern features.

- __Modular Architecture__. Possibilities for the implementation of three levels of logic availability.
  - Shared stateful logic pattern (known as "service") for decomposing applications logic to separate independent or one direction dependent modules with global accessibility.
  - Declaration one scope and use as many reactive values as you want without the need to define a new React context for each changeable value with context level accessibility.
  - And enjoy clean React components with local logic decomposition.

- __Decorators for clasess lovers__. Support OOP as one of the primary syntax. The implementation of transparent functional reactive programming (TFRP) with React (looks similar to Mobx). And the babel plugin for automatic wrap all arrow functions defined in the global scope with JSX inside to observe wrapper.


### Usage

Realar's adventure will start from "value", is an immutable reactive container such as "store" from Redux terminology

```javascript
const store = value(0)
```

You can easily make functional update signals similar to an "action" from Redux

```javascript
const inc = store.updater(state => state + 1)
const add = store.updater((state, num: number) => state + num)
```

Watch state updating

```javascript
store.to((state) => console.log(state))
```

And run signals as usual functions

```javascript
inc()     // console output: 1
add(10)   // console output: 11
```

[Try full example on RunKit](https://runkit.com/betula/60b4e0cab769ca0021660348)

The next step is React binding. Realar provides the beautiful api for working with React, and now you can use the first function.

```javascript
const App = () => {
  const state = useValue(store);
  return (
    <>
      <p>{state}</p>
      <button onClick={inc}>+</button>
    </>
  )
}
```






### Signals

The `signal` allows you to trigger an event or action and delivers the functionality to subscribe to it anywhere in your application code.

Usually, signal subscription (_by `on` function_) very comfortable coding in class constructors.

```javascript
const startAnimation = signal();

class Animation {
  constructor() {
    on(startAnimation, this.start);
  }
  start = async () => {
    console.log('animation starting...');
  }
}

shared(Animation);
startAnimation();
```
[Edit on RunKit](https://runkit.com/betula/602f62db23b6cd001adc5dfa)

If you making an instance of a class with a subscription in the constructor, though `shared`, `useLocal`, `useScoped` Realar functions, It will be unsubscribed automatically.

Below other examples

```javascript
const add = signal<number>();

const store = value(1);
on(add, num => store.val += num);

add(15);
console.log(store.val); // console output: 16
```
[Edit on RunKit](https://runkit.com/betula/6013af7649e8720019c9cf2a)

An signal is convenient to use as a promise.

```javascript
const fire = signal();

(async () => {
  for (;;) {
    await fire.promise; // await as a usual promise
    console.log('Fire');
  }
})();

setInterval(fire, 500);
```
[Edit on RunKit](https://runkit.com/betula/601e3b0056b62d001bfa391b)



### Core

The abstraction of the core is an implementation of functional reactive programming on javascript and binding that with React.

It uses usual mathematic to describe dependencies and commutation between reactive values.

In contradistinction to _stream pattern_, operator functions not needed. The reactive “sum” operator used a simple “+” operator (for example).

```javascript
const a = value(0)
const b = value(0)

const sum = () => a.val + b.val

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

Realar provides big possibility abstractions for reactive flow. We already know about reactive value container, reactive expressions, and subscribe mechanism. But also have synchronization between data, cycled reactions, cached selectors, transactions and etc.



### OOP Usage

Transparent functional reactive programming with classes, decorators and [babel jsx wrapper](https://github.com/betula/babel-plugin-realar)

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

It looks likes very clear and natively, and you can start development knows only two functions.

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

For best possibilities use [babel jsx wrapper](https://github.com/betula/babel-plugin-realar), your code will be so beautiful to look like.

But otherwise necessary to wrap all React function components that use reactive values inside to `observe` wrapper. [Try wrapped version on CodeSandbox](https://codesandbox.io/s/realar-counter-k9kmw?file=/src/App.tsx).

#### React component access visibility level

The basic level of scopes for React developers is a component level scope (_for example `useState`, and other standard React hooks has that level_).

Every React component instance has its own local state, which is saved every render for the component as long as the component is mounted.

In the Realar ecosystem `useLocal` hook used to make components local stateful logic.

```javascript
class CounterLogic {
  @prop value = 0;
  inc = () => this.value += 1
}

const Counter = () => {
  const { value, inc } = useLocal(CounterLogic);

  return (
    <p>{value} <button onClick={inc}>+</button></p>
  );
}

export const App = () => (
  <>
    <Counter />
    <Counter />
  </>
);
```
[Play wrapped on CodeSandbox](https://codesandbox.io/s/realar-component-level-scope-classes-m0i10?file=/src/App.tsx)

This feature can be useful for removing logic from the body of a component to keep that free of unnecessary code, and therefore cleaner.

#### React context access visibility level

```javascript
const Counter = () => {
  const { value, inc } = useScoped(CounterLogic);

  return (
    <p>{value} <button onClick={inc}>+</button></p>
  );
}

export const App = () => (
  <Scope>
    <Scope>
      <Counter />
      <Counter />
    </Scope>
    <Counter />
  </Scope>
);
```

[Play wrapped on CodeSandbox](https://codesandbox.io/s/realar-context-component-level-scope-classes-wivjv?file=/src/App.tsx)





### API

- [value](./docs/api.md)
- [selector](./docs/api.md)
- [on](./docs/api.md)
- [cache](./docs/api.md)
- [cycle](./docs/api.md)
- [sync](./docs/api.md)


### Demos

+ [Hello](https://github.com/realar-project/hello) - shared state demonstration.
+ [Todos](https://github.com/realar-project/todos) - todomvc implementation.
+ [Jest](https://github.com/realar-project/jest) - unit test example.


### Articles

+ [Multiparadigm state manager for React by ~2 kB.](https://dev.to/betula/multiparadigm-state-manager-for-react-by-2-kb-4kh1)
+ [The light decision for React state 👋](https://dev.to/betula/new-minimalistic-react-state-manager-3o39)


### Installation

```bash
npm install realar
# or
yarn add realar
```

- If you prefer classes with decorators [update your babel config for support](https://babeljs.io/docs/en/babel-plugin-proposal-decorators).
- And configure [babel jsx wrapper](https://github.com/betula/babel-plugin-realar) for automatic observation arrow function components if you want to use it.


Enjoy and happy coding!

