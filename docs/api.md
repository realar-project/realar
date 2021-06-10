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
  - [prop](#prop)
  - [cache](#cache)
- Shared technique
  - [shared](#shared)
  - initial
  - [free](#free)
  - [mock](#mock)
  - [unmock](#unmock)
- Unsubscribe scopes control
  - isolate
  - un
- Async api
  - [pool](#pool)
- Track and transactions
  - [transaction](#transaction)
  - [untrack](#untrack)
  - [untrack.func](#untrackfunc)
- React bindings
  - [observe](#observe)
  - [useValue](#usevalue)
  - [useValues](#usevalues)
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

The reactive container instance is also available as first argument of `on` function. [play on runkit.](https://runkit.com/betula/60c04347473de4001a59307e)

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
[Play on runkit](https://runkit.com/betula/601a73b26adfe70020a0e229)



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
[Play on runkit](https://runkit.com/betula/601a733c5bfc4e001a38def8)

- Takes a function as reactive expression.
- After each run: subscribe to all reactive values accessed while running
- Re-run on data changes


### Class decorators for TRFP

#### prop

`prop` - reactive value marker decorator. Each reactive value has an immutable state. If the immutable state will update, all who depend on It will refresh.

```javascript
class Todos {
  @prop items = [];

  constructor() {
    on(() => this.items, () => console.log('items changed'));
  }
}
```

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

The function for providing an instance of single instantiated shared dependency with global availability. You can use class or function as a dependency creator.

```javascript
const loader = () => {
  const count = value(0);
  return {
    active: count.select(state => state > 0),
    start: () => count.val++,
    stop: () => count.val--
  }
}

const sharedLoader = () => shared(loader);

// And every where in your add

const App = ({ children }) => {
  const loaderActiveState = useValue(sharedLoader().active);
  return <>
    {loaderActiveState ? 'loading...' : children}
  </>
}
```

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

The pool function provides the creation of a special function that detects started and finished asynchronous queries and performs information to "pending" value property. _[play on runkit](https://runkit.com/betula/60c159c3e67eb3001b11f6c2)_

```javascript
const load = pool(async (id) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  return await response.json();
});

const promise = load(1);
console.log(load.pending.val) // in console: true
```

The `pool` using in real world you can see in the [simple form example](./examples.md#simple-form).

### Track and transactions

#### transaction

If you need to run several assignments with only one dependency recalculation at the finish of. You should use the `transaction` function. _[play on runkit](https://runkit.com/betula/60c16ff3ad28480013022930)_

```javascript
const a = value(0);
const b = value(0);

on(() => a.val + b.val, sum => console.log('sum', sum));

transaction(() => {
  a.val = 1;
  b.val = 1;
});  // in console only one reaction with sum equals: 2

```

#### untrack

If you need reading reactive value without reactive dependency creation, the `untrack` function is your choice.

```javascript
const a = value(0);
const b = value(0);

on(() => a.val + untrack(() => b.val), sum => console.log('sum', sum));
a(2) // in console: sum 2
b(1) // nothing in console because the reactive value `b` is untracked
a(3) // in console: sum 4
```

#### untrack.func

You can make any function untracked with it.

```javascript
const a = value(0);
const b = value(0);

const sum = untrack.func(() => a.val + b.val);

on(sum, () => console.log('sum'));
a(1) // nothing in console because the reactive value `a` is untracked
b(1) // nothing in console too for the same reason
```

### React bindings

#### observe

```javascript
const name = value('Joe');
const change = name.updater((state) => state === 'Joe' ? 'Mike' : 'Joe');

const App = observe(() => {
  return <>
    <p>name: {name.val}</p>
    <button onClick={change}>change</button>
  </>
})
```

#### useValue

```javascript
const count = value(0);
const inc = value.updater((state) => state + 1);

const App = () => {
  const countState = useValue(count);
  const nextState = useValue(() => count.val + 1);

  return <>
    <p>count: {countState}</p>
    <p>next: {nextState}</p>
    <button onClick={inc}>inc</button>
  </>
}
```

#### useValues

```javascript
const name = value('Joe')
const secret = value('xx')

const change = () => {
  name.val += 'e';
  secret.val += 'x';
}

const App = () => {
  const values = useValues({ name, secret });
  return <>
    <p>name: {values.name}</p>
    <p>secret: {value.secret}</p>
    <button onClick={change}>change</button>
  </>
}
```

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



