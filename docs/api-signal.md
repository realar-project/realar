## signal

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

fire.promise.then(() => console.log('Fire'));
fire();

```
[Edit on RunKit](https://runkit.com/betula/601e3b0056b62d001bfa391b)

The `signal` instance has different methods:

- The state transformation
  - filter
  - filter.not
  - map
  - map.to
- Actions before updating
  - pre
  - pre.filter
  - pre.filter.not
- The state updating
  - update.by
  - updater
  - updater.multiple
- The state selectors
  - [select](#select)
  - select.multiple
- Subscription and syncronization
  - to
  - to.once
  - sync
  - promise
- Shortcut and type casting
  - wrap
  - as.value
- Static methods
  - from
