# Realar

[![npm version](https://img.shields.io/npm/v/realar?style=flat-square)](https://www.npmjs.com/package/realar) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/realar?style=flat-square)](https://bundlephobia.com/result?p=realar) [![code coverage](https://img.shields.io/coveralls/github/betula/realar?style=flat-square)](https://coveralls.io/github/betula/realar) [![typescript supported](https://img.shields.io/npm/types/typescript?style=flat-square)](./src/index.ts)

The state manager to reduce developers' coding time and increase the lifetime of your codebase.

Realar targeted to all scale applications up to complex enterprise solutions on modular architecture.

- _Logic free React components_. Perfect instruments for moving all component logic outside. Your React component will be clean from any unnecessary code, only view, only JSX, no more.
- _Lightweight and Fast_. Less then 5kB. Aims at the smallest size of the resulting bundle. And only parts are updated in which is really necessary to make changes.
- _Value and Signal_ is the big elephants remind Store and Action from Redux. Allows you to perform familiar coding techniques, and also add many modern features.
- _Declarative and Imperative_ both supported.
- _Stream_ event and value programming.
- _Modular Architecture_. Possibilities for the implementation of three levels of logic availability. Shared stateful is available for any part of your app. Scoped logic decomposition for React component context visibility. And React component local logic.
- _Decorators for classes lovers_. Support OOP as one of the primary syntaxes. The implementation of transparent functional reactive programming (TFRP) with React (looks similar to Mobx). And the babel plugin for automatic wrap all arrow JSX functions for the best clean code.
</p>


### Usage

You can make stores and "actions"

```javascript
const store = value(0)

const add = store.updater((state, num) => state + num)
const inc = store.updater(state => state + 1)
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

  constructor() {
    sync(() => this.state, console.log)
  }
}
```


### Documentation

- [Get started](./docs/get-started.md)
- [Core](./docs/core.md)
- [OOP usage](./docs/oop.md)
- API
  - [value](./docs/api.md)
  - [signal](./docs/api.md)
  - [selector](./docs/api.md)
  - [on](./docs/api.md)
  - [cache](./docs/api.md)
  - [cycle](./docs/api.md)
  - [sync](./docs/api.md)


### Demos

+ [Basic usage on codesandbox](https://codesandbox.io/s/realar-basic-example-41vvd?file=/src/App.tsx).
+ [Hello](https://github.com/realar-project/hello) - shared state demonstration.
+ [Todos](https://github.com/realar-project/todos) - todomvc implementation.
+ [Jest](https://github.com/realar-project/jest) - unit test example.

### In Production

+ [Card of the Day](https://apps.apple.com/app/card-of-the-day/id1547423880) - React Native mobile app.

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

