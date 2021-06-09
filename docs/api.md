## API

- Declarative framework
  - [value](./api-value.md)
  - [signal](./api-signal.md)
- Imperative framework
  - [on](#on)
  - on.once
  - [sync](#sync)
  - [cycle](#cycle)
- Class decorators for TRFP
  - prop
  - [cache](#cache)
- Shared technique
  - shared
  - initial
  - [free](#free)
  - [mock](#mock)
  - [unmock](#unmock)
- Unsubscribe scopes control
  - isolate
  - un
- Async api
  - pool
- Track and transactions
  - transaction
  - untrack
  - untrack.func
- React bindings
  - observe
  - useValue
  - useValues
  - useLocal
  - useScoped
  - useShared
  - Scope
  - [useJsx](#usejsx)


### Imperative framework

#### on

The next basic abstraction is expression.
Expression is a function that read reactive boxes or selectors. It can return value and write reactive values inside.

We can subscribe to change any reactive expression using `on` function (which also works with signal). _[play on runkit.](https://runkit.com/betula/6013ea214e0cf9001ac18e71)_

```javascript
const { get, set } = value(0);

const next = () => get() + 1;

on(next, (val, prev) => console.log(val, prev));

set(5); // We will see 6 and 1 in developer console output, It are new and previous value
```

In that example expression is `next` function, because It get value and return that plus one.

The reactive container instance is also available as first argument of `on` function. [Play on RunKit.](https://runkit.com/betula/60c04347473de4001a59307e)

```javascript
const count = value(0);

const next = count.map(v => v + 1);

on(next, (val, prev) => console.log(val, prev));

count(5); // We will see 6 and 1 in developer console output, It are new and previous value
```

#### on.once


#### sync

```javascript
const source = value(0);
const target = value(0);

sync(source, target);
// same as sync(() => source.get(), val => target(val));

source.set(10);

console.log(target.val) // 10
```
[Edit on RunKit](https://runkit.com/betula/601a73b26adfe70020a0e229)



#### cycle

```javascript
const { get, set } = value(0);

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


### Class decorators for TRFP

#### prop

#### cache

`cache` - is the decorator for define selector on class getter.

```javascript
class Todos {
  @prop items = [];

  @cache get completed() {
    return this.items.filter(item => item.completed);
  }
}
```

### Shared technique
#### shared
#### initial
#### free

Clean all cached shared instances. It's usually needed for testing or server-side rendering. Has no parameters. _[play on runkit](https://runkit.com/betula/60c08df507313e001af24f02)_

```javascript
const Shared = () => {
  console.log('initialized');
  un(() => console.log('destroyed'));
}

shared(Shared); // in console: initialized
free();         // in console: destroyed
```

#### mock

Define resolved value for any shareds. Necessary for unit tests.

```javascript
const mocked = mock(Shared, {
  run: jest.fn()
});

shared(Shared).run();
expect(mocked.run).toHaveBeenCalled();
```

#### unmock

Reset mocked value from shared. Possible to pass as many arguments as you need.

```javascript
mock(A, {});
mock(B, {});

unmock(A, B);
```

### Unsubscribe scopes control
#### isolate
#### un
### Async api
#### pool
### Track and transactions
#### transaction
#### untrack
### React bindings
#### observe
#### useValue
#### useValues
#### useLocal
#### useScoped
#### useShared
#### Scope
#### useJsx

You can connect your reactivity to React using a new component locally defined in yours. All reactive values read in that place will be subscribed. Each time when receiving new values, a locally defined component will be updated, and only one, without any rerendering to owner component. It can be used as a performance optimization for rerendering as smaller pieces of your component tree as it possible. _[play on codesandbox](https://codesandbox.io/s/realar-api-react-binding-usejsx-8o6oc?file=/src/App.tsx)_

```javascript
const count = value(0);
// ...
const App = () => {
  const Body = useJsx(() => {
    // Make reactive dependency by reading value's "val" property
    const val = count.val;

    if (val === 0) return <>{val} zero</>;
    if (val > 0) return <b>{val} positive</b>;
    return <i>{val} negative</i>;
  });

  return (
    <p>
      <button onClick={api.inc}>+</button>
      <button onClick={api.dec}>-</button>
      <Body />
    </p>
  );
};
```



