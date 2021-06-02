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

You can make stores and "actions"

```javascript
const store = value(0)

const add = store.updater((state, num) => state + num)
const inc = add.map.to(1)
```

And bind to React easily

```javascript
const App = () => {
  const state = useValue(store)

  return <p>{state} <button onClick={inc}>+</button></p>
}
```

You can make streams

```javascript
const addendum = value('0').pre(ev => ev.target.value)
const sum = signal()
  .map(() => +addendum.val)
  .filter()
  .to(add);
```

And bind to React

```javascript
const App = () => {
  const addendumState = useValue(addendum)
  return <p>
    <input value={addendumState} onChange={addendum} />
    <button onClick={sum}>sum</button>
  </p>
}
```

You can use classes with decorators

```javascript
class Counter {
  @prop state = 0;

  add = (num) => this.state += num;
  inc = () => this.add(1);
}
```

And bind to React

```javascript
const App = observe(() => {
  const { state, inc } = useLocal(Counter)

  return <p>{state} <button onClick={inc}>+</button></p>
})
```

And you can use it together

```javascript
class Positive {
  @cache get state() {
    return store.val > 0 ? 'positive' : 'non'
  }
}

const App = observe(() => {
  const { state } = useLocal(Positive)

  return <p>{state} <button onClick={inc}>+</button></p>
})
```


### Core

The abstraction of the core is an implementation of functional reactive programming on javascript.

It uses usual mathematic to describe dependencies and commutation between reactive values.

In contradistinction to _stream pattern_, operator functions not needed. The reactive “sum” operator (in example below) used a simple “+” operator.

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



### Documentation

- [Get started](./docs/get-started.md)
- API
  - [value](./docs/api.md)
  - [signal](./docs/api.md)
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

