## API

- Declarative framework
  - [value](#value)
  - [signal](#signal)
- Imperative framework
  - [on](#on)
  - [sync](#sync)
  - [cycle](#cycle)
- Class decorators for TRFP
  - [prop]()
  - [cache](#cache)
- Shared technique
  - [shared]()
  - [initial]()
  - [free]()
  - [mock]()
  - [unmock]()
- Unsubscribe scopes control
  - [isolate]()
  - [un]()
- Additional api
  - [local.inject]()
  - [contextual]()
  - [pool]()
- Track and transactions
  - [transaction]()
  - [untrack]()
- React bindings
  - [observe]()
  - [useValue]()
  - [useValues]()
  - [useLocal]()
  - [useScoped]()
  - [useShared]()
  - [Scope]()
  - [useJsx]()


### value

The first abstraction of Realar is reactive container - `value`.
The `value` is a place where your store some data as an immutable struct.
When you change value (rewrite to a new immutable struct) all who depend on It will be updated synchronously.

For create new value we need `value` function from `realar`, and initial value that will store in reactive container.
The call of `value` function returns array of two functions.
- The first is value getter.
- The second one is necessary for save new value to reactive container.

```javascript
const { get, set } = value(0);

set(get() + 1);

console.log(get()); // 1
```
[Edit on RunKit](https://runkit.com/betula/6013af7649e8720019c9cf2a)

In that example
- for a first we created `value` container for number with initial zero;
- After that, we got the value, and set to its value plus one;
- Let's print the result to the developer console, that will is one.

We learned how to create a value, set, and get it.

### value.select

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


### signal

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

