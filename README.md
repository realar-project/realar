# Realar

[![npm version](https://img.shields.io/npm/v/realar?style=flat-square)](https://www.npmjs.com/package/realar) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/realar?style=flat-square)](https://bundlephobia.com/result?p=realar) [![code coverage](https://img.shields.io/coveralls/github/betula/realar?style=flat-square)](https://coveralls.io/github/betula/realar) [![typescript supported](https://img.shields.io/npm/types/typescript?style=flat-square)](./src/index.ts)

Object oriented state manager for React based on [reactive mathematic](https://github.com/betula/reactive-box).

[Light](https://bundlephobia.com/result?p=realar), [Fast](https://github.com/betula/reactive-box-performance), and Pretty looked :kissing_heart:

Realar targeted to clean code, modulable architecture, and time of delivery user experience.

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

Realar **targeted to** all scale applications up to complex enterprise solutions on micro apps architecture.

You can use as many from Realar as you want. For small websites or theme switchers, two functions are enough:ok_hand: Step by step on applications scale stairs you can take more and more. From sharing state to all application parts, to modulable architecture with micro apps composition.

- __Decorators for clasess lovers__. And babel plugin for automatic wrap all arrow functions defined in the global scope with JSX inside to observe wrapper for the total implementation of transparent functional reactive programming (TFRP) in javascript with React.

- __Logic free React components__. Perfect instruments for moving all component logic to the class outside. Your React component will be pure from any unnecessary code, only view, only JSX, no more.

- __Shared stateful logic decomposition__. The pattern for decomposing applications logic to separate independent or one direction dependent modules. Each module can have its own set of reactive values. (ssr, comfort “mock” mechanism for simple unit testing). Shared stateful logic is a single instantiated class with total accessibility from all parts of your application. In another terminology - services.

- __Lightweight and Fast__. Really light ~2kB. And only those components are updated in which it is really necessary to make changes.

- __React component context level scopes__. Declaration one scope and use as many reactive values as you want without the need to define a new React context for each changeable value.

- __Signals__ are a necessary part of reactive communication, well knows for most javascript developers as actions or events. In Realar that possibility provides through signal abstraction. Possibility for subscribing to signal, call signal and wait for the next signal value everywhere on the codebase. And for a tasty, reading the last called value from a signal.


### Usage

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

For best possibilities use [realar babel plugin](https://github.com/betula/babel-plugin-realar), your code will be so beautiful to look like.

But otherwise necessary to wrap all React function components that use reactive values inside to `observe` wrapper. [Try wrapped version on CodeSandbox](https://codesandbox.io/s/realar-counter-k9kmw?file=/src/App.tsx).

### Access visibility levels

The basic level of scopes for React developers is a **component level scope** (_for example `useState`, and other standard React hooks has that level_).

Every React component instance has its own local state, which is saved every render for the component as long as the component is mounted.

In the Realar ecosystem `useLocal` hook used to make components local state.

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

**context component level scope**

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
const add = signal();

const store = value(1);
on(add, num => store.val += num);

add(15);
console.log(store.val); // 16
```
[Edit on RunKit](https://runkit.com/betula/6013af7649e8720019c9cf2a)

An signal is convenient to use as a promise.

```javascript
const fire = signal();

const listen = async () => {
  for (;;) {
    await fire; // await as a usual promise
    console.log('Fire');
  }
}

listen();
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

Realar provides big possibility abstractions for reactive flow. We already know about reactive value container, reactive expressions, and subscribe mechanism. But also have synchronization between data, cycled reactions, cached selectors, and transactions.

### Low level usage

```javascript
const count = value(0);

const tick = () => count.val++;
setInterval(tick, 200);

const App = () => {
  const value = useValue(count);
  return (
    <p>{value}</p>
  )
}
```
[Try on CodeSandbox](https://codesandbox.io/s/realar-ticker-functional-6s3mx?file=/src/App.tsx)

```javascript
import React from "react";
import { value, useValue } from "realar";

const [get, set] = value(0);

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

### API

**value**

The first abstraction of Realar is reactive container - `value`.
The `value` is a place where your store some data as an immutable struct.
When you change value (rewrite to a new immutable struct) all who depend on It will be updated synchronously.

For create new value we need `value` function from `realar`, and initial value that will store in reactive container.
The call of `value` function returns array of two functions.
- The first is value getter.
- The second one is necessary for save new value to reactive container.

```javascript
const [get, set] = value(0);

set(get() + 1);

console.log(get()); // 1
```
[Edit on RunKit](https://runkit.com/betula/6013af7649e8720019c9cf2a)

In that example
- for a first we created `value` container for number with initial zero;
- After that, we got the value, and set to its value plus one;
- Let's print the result to the developer console, that will is one.

We learned how to create a value, set, and get it.

**on**

The next basic abstraction is expression.
Expression is a function that read reactive boxes or selectors. It can return value and write reactive values inside.

We can subscribe to change any reactive expression using `on` function _(which also works with signal)_.

```javascript
const [get, set] = value(0);

const next = () => get() + 1;

on(next, (val, prev) => console.log(val, prev));

set(5); // We will see 6 and 1 in developer console output, It are new and previous value
```
[Edit on RunKit](https://runkit.com/betula/6013ea214e0cf9001ac18e71)

In that example expression is `next` function, because It get value and return that plus one.

**selector**

Necessary for making high-cost calculations and cache them for many times of accessing without changing source dependencies. And for downgrade (selection from) your hierarchical store.

```javascript
const store = value({
  address: {
    city: 'NY'
  }
});

const address = selector(() => store.val.address);

on(address, ({ city }) => console.log(city)); // Subscribe to address selector

console.log(address.val.city); // Log current value of address selector

store.update(state => ({
  ...state,
  user: {}
}));
// Store changed but non reaction from address selector

store.update(state => ({
  ...state,
  address: {
    city: 'LA'
  }
}));
// We can see reaction on deleveloper console output with new address selector value
```
[Edit on RunKit](https://runkit.com/betula/60338ff8dbe368001a10be8c)

**cache**

`cache` - is the decorator for define `selector` on class getter.

```javascript
class Todos {
  @prop items = [];

  @cache get completed() {
    return this.items.filter(item => item.completed);
  }
}
```

**cycle**

```javascript
const [get, set] = value(0);

cycle(() => {
  console.log(get() + 1);
});

set(1);
set(2);

// In output of developer console will be 1, 2 and 3.
```
[Edit on RunKit](https://runkit.com/betula/601a733c5bfc4e001a38def8)

- Takes a function as reactive expression.
- After each run: subscribe to all reactive values accessed while running
- Re-run on data changes

**sync**

```javascript
const [getSource, setSource] = value(0);
const [getTarget, setTarget] = value(0);

sync(getSource, setTarget);
// same as sync(() => getSource(), val => setTarget(val));

setSource(10);

console.log(getTarget()) // 10
```
[Edit on RunKit](https://runkit.com/betula/601a73b26adfe70020a0e229)

_Documentation not ready yet for `effect`, `initial`, `mock`, `unmock`, `free`, `transaction`, `untrack` functions. It's coming soon._

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

And update your babel config for support class decorators and using [babel plugin](https://github.com/betula/babel-plugin-realar) for automatic observation arrow function components.

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

