## Get started

Realar's adventure will start from "value", is an immutable reactive container such as "store" from Redux terminology

```javascript
import { value } from 'realar'

const store = value(0)
```

You can easily make functional update signals similar to an "action" from Redux

```javascript
const inc = store.updater(state => state + 1)
const add = store.updater((state, num: number) => state + num)
```

Watch state updating

```javascript
store.to((state) => console.log(state))
```

And run signals as usual functions

```javascript
inc()     // console output: 1
add(10)   // console output: 11
```

[Try full example on RunKit](https://runkit.com/betula/60b4e0cab769ca0021660348)

The next step is React binding. Realar provides the beautiful api for working with React, and now you can use the first function.

```javascript
import { useValue } from 'realar'

const App = () => {
  const state = useValue(store)
  return (
    <>
      <p>{state}</p>
      <button onClick={inc}>+</button>
    </>
  )
}
```
