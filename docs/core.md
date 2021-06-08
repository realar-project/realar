## Core

The abstraction of the core based on [reactive-box](https://github.com/betula/reactive-box) is an implementation of functional reactive programming on javascript with making dependencies by reading.

It uses usual mathematic to describe dependencies and commutation between reactive values.

```javascript
const a = value(0)
const b = value(0)

const sum = () => a.val + b.val

on(sum, console.log)
```

That code has a graph of dependencies inside. “sum” - reactive expression depends from “A” and “B”, and will react if “A” or “B” changed. It is perfectly demonstrated with “on” function (that subscribes to reactive expression) and “console.log” (developer console output).

In contradistinction to _stream pattern_, operator functions not needed. The reactive “sum” operator (in the example below) used a simple “+” operator.

On each change of “A” or “B” a new value of that sum will appear in the developer console output.

And for tasty easy binding reactive expressions and values with React components.

```javascript
const App = () => {
  const val = useValue(sum);
  return (
    <p>{val}</p>
  );
}
```

That component will be updated every time when new sum value is coming.

The difference from exists an implementation of functional reactive programming (mobx) in Realar dependency collector provides the possibility to write in selectors and nested writable reactions.

Realar provides big possibility abstractions for reactive flow. We already know about reactive value container, reactive expressions, and subscribe mechanism. But also have synchronization between data, cycled reactions, cached selectors, transactions and etc.
