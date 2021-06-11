## value

The first abstraction of Realar is reactive container - `value`.
The `value` is a place where your store some data as an immutable struct.
When you change value (rewrite to a new immutable struct) all who depend on It will be updated synchronously.

We need `value` function from `realar` and initial value that will store in a reactive container for the creation new value.
The call of `value` function returns the reactive container.
- The `val` property extracts a value stored in the container and can set the new value using the usual javascript assignment operator.
- The reactive container has a callable interface as usual function, an argument of that used for new value setting.
- There are `get`, `set` and `update` methods implemented too.

```javascript
const store = value(0)

store.val += 1
store(store.val + 1)
store.set(store.get() + 1)
store.update(state => state + 1)

console.log(store.val) // 4
```
[Edit on RunKit](https://runkit.com/betula/60bf30ec1d58dc0019e826b1)

In that example
- for a first, we created `value` container for number, with an initial zero
- After that, we got the value and set it to its value plus one with four different ways
- Let's print the result to the developer console, which will is four

We learned how to create a value, set it, and get it.

The `value` reactive container instance has different methods for perfect operations with state:

- The state updating
  - [update](#update)
  - [update.by](#updateby)
  - [updater](#updater)
  - [updater.multiple](#updatermultiple)
- Selection from state
  - [select](#select)
  - [select.multiple](#selectmultiple)
- Subscription and syncronization
  - to
  - to.once
  - sync
  - promise
- Actions before updating
  - pre
  - pre.filter
  - pre.filter.not
- The state transformation
  - map
- Shortcut and type casting
  - wrap
  - as.signal
- Static methods
  - combine
  - from


### The state updating

#### update

Update state of a reactive container using a function with current state passed as the first argument.

```javascript
const v = value(0)

v.update(state => state + 10)

console.log(v.val) // in console: 10
```

#### update.by

Update state of a reactive container using a signal, or another reactive expression.

```javascript
const add = signal<number>();

const v = value(0)
  .update.by(add, (state, num) => state + num);

add(10);
console.log(v.val) // in console: 10
```

#### updater

Create a new signal for updating a reactive container.

```javascript
const v = value(0)

const add = v.updater((state, num: number) => state + num)

add(10);
console.log(v.val) // in console: 10
```

#### updater.multiple

Create multiple new signals for updating a reactive container.

```javascript
const v = value(0)

const api = v.updater.multiple({
  inc: (state) => state + 1,
  add: (state, num: number) => state + num
});

add(10);
inc();
console.log(v.val) // in console: 11
```

### Selection from state

#### select

Necessary for making high-cost calculations and cache them for many times of accessing without changing source dependencies. And for downgrade (selection from) your hierarchical store. _[play on runkit](https://runkit.com/betula/60c092996e3b91001aadb872)_

```javascript
const store = value({
  city: 'NY'
});

const city = store.select(state => state.city);

// Subscribe to city selector updates
city.to(name => console.log(name));

// We will see reaction on deleveloper console output with new city selector value
store.update(state => ({
  ...state,
  city: 'LA'
}));
```

#### select.multiple

Create multiple selectors from the state of the reactive container.

```javascript
const store = value({
  city: 'NY',
  user: 'Joe'
});

const { city, user } = store.select.multiple({
  city: state => state.city,
  user: state => state.user
});

// Subscribe to city selector updates
city.to(name => console.log('city', name));
// And to user
user.to(name => console.log('user', name));

// We will see reaction on deleveloper console output with new city and user selector values
store.update(state => ({
  ...state,
  city: 'LA',
  user: 'Mike'
}));
```

### Subscription and syncronization

#### to

#### to.once

#### sync

#### promise

### Actions before updating

#### pre

#### pre.filter

#### pre.filter.not

### The state transformation

#### map

### Shortcut and type casting

#### wrap

#### as.signal

### Static methods

#### combine

#### from

