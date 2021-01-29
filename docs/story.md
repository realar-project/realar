
**box**

The first abstraction of Realar is reactive container - `box`.
The `box` is a place where your store some data as an immutable struct.
When you change box value (rewrite to a new immutable struct) all who depend on It will be updated synchronously.

For create new box we need `box` function from `realar`, and initial value that will store in reactive container.
The call of `box` function returns array of two functions.
- The first is value getter.
- The second one is necessary for save new value to reactive container.

```javascript
const [get, set] = box(0);

set(get() + 1);

console.log(get()); // 1
```
[Edit on RunKit](https://runkit.com/betula/6013af7649e8720019c9cf2a)

In that example
- for a first we created `box` container for number with initial zero;
- After that, we got the box value, and set to box its value plus one;
- Let's print the result to the developer console, that will is one.

We learned how to create a box, set, and get its value.

**on**

The next basic abstraction is expression.
Expression is a function that read reactive boxes or selectors. It can return value and write reactive boxes inside.

We can subscribe to change any reactive expression using `on` function.

```javascript
const [get, set] = box(0);

const next = () => get() + 1;

on(next, (val, prev) => console.log(val, prev));

set(5); // We will see 6, 1 in developer console output, It are new and previous value
```
[Edit on RunKit](https://runkit.com/betula/6013ea214e0cf9001ac18e71)

In that example expression is `next` function, because It get box value and return that plus one.

**action**

**sel**

**shared**


