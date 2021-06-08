## API

- Declarative framework
  - [value](./api-value.md)
  - [signal](./api-signal.md)
- Imperative framework
  - [on](#on)
  - [sync](#sync)
  - [cycle](#cycle)
- Class decorators for TRFP
  - prop
  - [cache](#cache)
- Shared technique
  - shared
  - initial
  - free
  - mock
  - unmock
- Unsubscribe scopes control
  - isolate
  - un
- Async api
  - pool
- Track and transactions
  - transaction
  - untrack
- React bindings
  - observe
  - useValue
  - useValues
  - useLocal
  - useScoped
  - useShared
  - Scope
  - useJsx



### on

The next basic abstraction is expression.
Expression is a function that read reactive boxes or selectors. It can return value and write reactive values inside.

We can subscribe to change any reactive expression using `on` function _(which also works with signal)_.

```javascript
const { get, set } = value(0);

const next = () => get() + 1;

on(next, (val, prev) => console.log(val, prev));

set(5); // We will see 6 and 1 in developer console output, It are new and previous value
```
[Edit on RunKit](https://runkit.com/betula/6013ea214e0cf9001ac18e71)

In that example expression is `next` function, because It get value and return that plus one.


### sync

```javascript
const source = value(0);
const target = value(0);

sync(source, target);
// same as sync(() => source.get(), val => target(val));

source.set(10);

console.log(target.val) // 10
```
[Edit on RunKit](https://runkit.com/betula/601a73b26adfe70020a0e229)



### cycle

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



### cache

`cache` - is the decorator for define `selector` on class getter.

```javascript
class Todos {
  @prop items = [];

  @cache get completed() {
    return this.items.filter(item => item.completed);
  }
}
```





