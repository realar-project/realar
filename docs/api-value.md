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
  - update.by
  - updater
  - updater.multiple
- Selection from state
  - [select](#select)
  - select.multiple
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
  - map.to
- Shortcut and type casting
  - wrap
  - as.signal
- Static methods
  - combine
  - from


### select

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


