## signal

The `signal` allows you to trigger an event or action and delivers the functionality to subscribe to it anywhere in your application code. Signal has the big part equals with the [value](./api-value.md), but have an important difference - you can call signal with the same state, but value can be updated only to a new state is not equals previous one. _[play on runkit](https://runkit.com/betula/60c467c1cd62c9001b408847)_

```javascript
const add = signal<number>();

const store = value(1)
  .update.by(add, (state, num: number) => state + num)

add(15);
console.log(store.val); // console output: 16

add(15);
console.log(store.val); // console output: 31
```


Most of the signal api such as [value](./api-value.md) api, but exist different methods:

- The stopping signal flow
  - filter
  - filter.not
- The state flow transformation
  - map.to
  - map
- Casting signal to the value
  - as.value


And signal don't have similar to [value.combine](./api-value.md#valuecombine) method.

The list of methods similar to the value:

- The state updating
  - [update](#update)
  - [update.by](#updateby)
  - [updater](#updater)
  - [updater.multiple](#updatermultiple)
- The state selectors
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
- Shortcut
  - [wrap](#wrap)
- Static method
  - [signal.from](#signalfrom)


### The state updating

#### update

Update state of a reactive container using a function with current state passed as the first argument.

```javascript
const v = signal(0)

v.update(state => state + 10)

console.log(v.val) // in console: 10
```

#### update.by

Update state of a reactive container using a signal, or another reactive expression.

```javascript
const add = signal<number>();

const v = signal(0)
  .update.by(add, (state, num) => state + num);

add(10);
console.log(v.val) // in console: 10
```

#### updater

Create a new signal for updating a reactive container.

```javascript
const v = signal(0)

const add = v.updater((state, num: number) => state + num)

add(10);
console.log(v.val) // in console: 10
```

#### updater.multiple

Create multiple new signals for updating a reactive container.

```javascript
const v = signal(0)

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

Necessary for making high-cost calculations and cache them for many times of accessing without changing source dependencies. And for downgrade (selection from) your hierarchical store. _[play on runkit](https://runkit.com/betula/60c45fefa3dac700199b37d1)_

```javascript
const store = signal({
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
const store = signal({
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
const v = signal<number>()

v.to((state, prev) => console.log(state, prev));

v(1) // in console: 1 undefined
v(5) // in console: 5 1
v(9) // in console: 9 5
```

#### to.once

Subscribe to change reactive container only once

```javascript
const v = signal(0)

v.to.once((state, prev) => console.log(state, prev));

v(1) // in console: 1 0
v(5) // nothing in console
```

#### sync

Subscribe to change reactive container with initialization call. Useful for "connect" one signal to another. Two directional synchronizations, the same as for the [value sync](./api-value.md#sync), are not possible because the signal must respond to each call the same way for equal values. _[play on runkit](https://runkit.com/betula/60c4608e3f316f0019e8b653)_

```javascript
const a = signal<number>();
const b = signal<number>();

sync(a, b);

a(10);
console.log(b.val) // in console: 10
```

#### promise

The promise for the next state of signal. _[play on runkit](https://runkit.com/betula/60c462fbcd62c9001b4085ee)_

```javascript
const v = signal(0);

v.promise
  .then((state) => console.log(state));

v(10); // in console: 10
```

### Actions before updating

#### pre

You can prepend modification of your reactive container with additional function which will be called before the state modification.

```javascript
const v = signal(0);

const fromstr = v.pre((str: string) => +str);

fromstr('10');
console.log(fromstr.val === 10) // in console: true
```

The most often case for its functionality is the prepending for input events. You can write event object to the reactive container, but store and read the value from element passed through `event.target.value`.

```javascript
const input = signal('Joe')
  .pre((ev: React.ChangeEvent<HTMLInputElement>) => ev.target.value);

const Input = observe(() => (
  <input value={input.val} onChange={input} />
))
```

#### pre.filter

You can check the value before the reactive container modification. If checker returns false state not be updated, if true - passing and update.

```javascript
const enabled = signal(false)

const name = signal('Joe').pre.filter(enabled)
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
const disabled = signal(false)

const name = signal('Joe')
  .pre.filter.not(disabled)
  .to(state => console.log(state));

name('Do') // in console: Do

disabled(true)
name('Mike') // nothing changing because the "disabled" state is true
```

### Shortcut

#### wrap

This is the shortcut for [pre](#pre) and [map](#map) applied to a signal.

```javascript
const v = signal('');

const v.pre(ev => ev.target.value).map(val => +val || 0)

// And the shortcutted version
const v.wrap(ev => ev.target.value, val => +val || 0)
```

### Static method

#### signal.from

Create new readonly or usual reactive container from one or two reactive expressions

```javascript
const v = signal(1);

signal.from(() => v.val + 1).to(state => console.log(state))
signal.from(v)     // readonly "v"
signal.from(v, v)  // give the same signal as "v"

const p = signal.from(() => v.val, state => (v.val += state));
console.log(p.val)  // in console: 1

p(10)               // in console: 12
console.log(p.val)  // in console: 11
```
