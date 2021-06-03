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
