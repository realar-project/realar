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
[Play on runkit](https://runkit.com/betula/60bf30ec1d58dc0019e826b1)

In that example
- for a first, we created `value` container for number, with an initial zero
- After that, we got the value and set it to its value plus one with four different ways
- Let's print the result to the developer console, which will is four

We learned how to create a value, set it, and get it.

- Casting value to the signal
  - [as.signal](#assignal)
- Static methods
  - [value.combine](#valuecombine)
  - [value.from](#valuefrom)

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
  - [to](#to)
  - [to.once](#toonce)
  - [sync](#sync)
  - [promise](#promise)
- Actions before updating
  - [pre](#pre)
  - [pre.filter](#prefilter)
  - [pre.filter.not](#prefilternot)
- The state transformation
  - [map](#map)
- Shortcut
  - [wrap](#wrap)


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

Subscribe to change reactive container

```javascript
const v = value(0)

v.to((state, prev) => console.log(state, prev));

v(1) // in console: 1 0
v(5) // in console: 5 1
v(9) // in console: 9 5
```

#### to.once

Subscribe to change reactive container only once

```javascript
const v = value(0)

v.to.once((state, prev) => console.log(state, prev));

v(1) // in console: 1 0
v(5) // nothing in console
```

#### sync

Subscribe to change reactive container with initialization call. Useful for "connect" one value to another. _[play on runkit](https://runkit.com/betula/60c314c95b2d8e001a557de6)_

```javascript
const a = value(0);
const b = value(0);

sync(b, a);
sync(a, b);

a(10);
console.log(b.val) // in console: 10
b(11);
console.log(a.val) // in console: 11
```

#### promise

The promise for the next value. _[play on runkit](https://runkit.com/betula/60c3169d751eca001ae034ae)_

```javascript
const v = value(0);

v.promise
  .then((state) => console.log(state));

v(10); // in console: 10
```

### Actions before updating

#### pre

You can prepend modification of your reactive container with additional function which will be called before the state modification.

```javascript
const v = value(0);

const fromstr = v.pre((str: string) => +str);

fromstr('10');
console.log(fromstr.val === 10) // in console: true
```

The most often case for its functionality is the prepending for input events. You can write event object to the reactive container, but store and read the value from element passed through `event.target.value`.

```javascript
const input = value('Joe')
  .pre((ev: React.ChangeEvent<HTMLInputElement>) => ev.target.value);

const Input = observe(() => (
  <input value={input.val} onChange={input} />
))
```

#### pre.filter

You can check the value before the reactive container modification. If checker returns false state not be updated, if true - passing and update.

```javascript
const enabled = value(false)

const name = value('Joe').pre.filter(enabled)
// possible to pass not only the reactive container, but any expression too
// .pre.filter(() => barrier.val)

name('Do') // nothing changing because the "enabled" state is false
console.log(name.val) // in concole: Joe

enabled(true)
name('Mike')
console.log(name.val) // in console: Mike
```

#### pre.filter.not

Such as [pre.filter](#prefilter) but with an inverted filter value.

```javascript
const disabled = value(false)

const name = value('Joe')
  .pre.filter.not(disabled)
  .to(state => console.log(state));

name('Do') // in console: Do

disabled(true)
name('Mike') // nothing changing because the "disabled" state is true
```

### Shortcut

#### wrap

This is the shortcut for [pre](#pre) and [map](#map) applied to a value.

```javascript
const v = value('');

const v.pre(ev => ev.target.value).map(val => +val || 0)

// And the shortcutted version
const v.wrap(ev => ev.target.value, val => +val || 0)
```

### The state transformation

#### map

The map method making new value with transformed output state value.

```javascript
const current = value(0)
const next = current.map(state => state + 1)

next(2)
console.log(next.val) // in console: 3
```

The map callback can contain connection to other reactive expressions by reading inside

```javascript
const current = value(1)
const add = value(2)

current
  .map(state => state + add.val)
  .to(state => console.log(state))

current(2)  // in console: 4
add(3)      // in console: 5
```

### Casting value to the signal

#### as.signal

Represent value as the [signal](./api-signal.md). The setter will be passed without any transformation, but the signal's getter stay reactioning only by the changed state. This method is useful for the next filtering of state. _[play on runkit](https://runkit.com/betula/60d41118b416ee001ab79b4f)_

```javascript
const v = value(0)
  .as.signal()
  .filter(n => n > 5)
  .to(state => console.log(state));

v(0) // nothing in console because the state has no changing
v(5) // nothing in console because the state not greater than 5
v(6) // in console: 6
```

### Static methods

#### value.combine

Combine several reactive containers of reactive expressions to one

```javascript
const user = value('Joe')
const city = value('LA')

const contact = value.combine({ user, city })

concact.sync(state => console.log(state)) // in console: { user: 'Joe', city: 'LA' }
```

#### value.from

Create new readonly or usual reactive container from one or two reactive expressions

```javascript
const v = value(1);

value.from(() => v.val + 1).to(state => console.log(state))
value.from(v)     // readonly "v"
value.from(v, v)  // give the same value as "v"

const p = value.from(() => v.val, state => (v.val += state));
console.log(p.val)  // in console: 1

p(10)               // in console: 12
console.log(p.val)  // in console: 11
```
