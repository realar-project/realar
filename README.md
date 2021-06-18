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

You can make stores and "actions" <sup>_[play on runkit](https://runkit.com/betula/60c071ff26dea9001373459c)_</sup>

```javascript
const store = value(0)

const add = store.updater((state, num) => state + num)
const inc = store.updater(state => state + 1)
```

And bind to React easily <sup>_[play on codesandbox](https://codesandbox.io/s/realar-readme-second-example-ld0g1?file=/src/App.tsx)_</sup>

```javascript
const App = () => {
  const state = useValue(store)

  return <p>{state}
    <button onClick={inc}>+</button>
  </p>
}
```

You can make streams <sup>_[play on runkit](https://runkit.com/betula/60c073765105e1001311b294)_</sup>

```javascript
const addendum = value('0').pre(ev => ev.target.value)
const sum = signal()
  .map(() => +addendum.val)
  .filter()
  .to(add)
```

And bind to React <sup>_[play on codesandbox](https://codesandbox.io/s/realar-readme-fourth-example-18pcj?file=/src/App.tsx)_</sup>

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
  @prop state = 0

  add = (num) => this.state += num
  inc = () => this.add(1)
}
```

And bind to React <sup>_[play on codesandbox](https://codesandbox.io/s/realar-readme-example-with-classes-j4q4e?file=/src/App.tsx)_</sup>

```javascript
const App = observe(() => {
  const { state, inc } = useLocal(Counter)

  return <p>{state}
    <button onClick={inc}>+</button>
  </p>
})
```

And you can use it together <sup>_[play on codesandbox](https://codesandbox.io/s/realar-readme-example-together-315r8?file=/src/App.tsx)_</sup>

```javascript
const counter = new Counter()

const store = value.from(() => counter.state)

export const App = observe(() => (
  <p>
    {store.val}
    <button onClick={counter.inc}>+</button>
  </p>
))
```


### Documentation

- [Get started](./docs/get-started.md)
- [Classes usage](./docs/classes.md)
- [Core](./docs/core.md)
- Examples
  - [Simple form](./docs/examples.md#simple-form)
  - [Basic usage](./docs/examples.md#basic-usage)
- API
  - Declarative framework
    - [value](./docs/api-value.md)
    - [signal](./docs/api-signal.md)
  - Imperative framework
    - [on](./docs/api.md#on)
    - [on.once](./docs/api.md#ononce)
    - [sync](./docs/api.md#sync)
    - [cycle](./docs/api.md#cycle)
  - Class decorators for TRFP
    - [prop](./docs/api.md#prop)
    - [cache](./docs/api.md#cache)
  - Shared technique
    - [shared](./docs/api.md#shared)
    - [initial](./docs/api.md#initial)
    - [free](./docs/api.md#free)
    - [mock](./docs/api.md#mock)
    - [unmock](./docs/api.md#unmock)
  - Unsubscribe scopes control
    - [un](./docs/api.md#un)
    - [isolate](./docs/api.md#isolate)
  - Async api
    - [pool](./docs/api.md#pool)
  - Track and transactions
    - [transaction](./docs/api.md#transaction)
    - [untrack](./docs/api.md#untrack)
    - [untrack.func](./docs/api.md#untrackfunc)
  - React bindings
    - [observe](./docs/api.md#observe)
    - [observe.nomemo](./docs/api.md#observenomemo)
    - [useValue](./docs/api.md#usevalue)
    - [useValues](./docs/api.md#usevalues)
    - [useShared](./docs/api.md#useshared)
    - [useLocal](./docs/api.md#uselocal)
    - [Scope, useScoped](./docs/api.md#scope-usescoped)
    - [useJsx](./docs/api.md#usejsx)



### Demos

+ [Hello](https://github.com/realar-project/hello) - shared state demonstration.
+ [Todos](https://github.com/realar-project/todos) - todomvc implementation.
+ [Jest](https://github.com/realar-project/jest) - unit test example.

### In Production

+ [Card of the Day](https://apps.apple.com/app/card-of-the-day/id1547423880) - React Native mobile app.

### Articles

+ [State manager of dream](https://dev.to/betula/state-manager-of-dream-5766-temp-slug-158417?preview=4b030f68851211fd02704f12d7742ce193a8f9c893afd1e4249b88023e14d57b1e5a8a02c4aaa924f22beb44c69bba20617a0523e952120eb97ef344)

### Installation

```bash
npm install realar
# or
yarn add realar
```

- If you prefer classes with decorators [update your babel config for support](https://babeljs.io/docs/en/babel-plugin-proposal-decorators).
- And configure [babel jsx wrapper](https://github.com/betula/babel-plugin-jsx-wrapper#realar) for automatic observation arrow function components if you want to use it.


Enjoy and happy coding!

