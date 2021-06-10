## Examples

### Simple form

Demonstrate using values with [pre](./api-value.md#pre) for easy form input bindings and [pool](./api.md#pool).

[Play on codesandbox](https://codesandbox.io/s/realar-simple-form-example-v7f13?file=/src/App.tsx)

```javascript
import { value, useLocal, useValues, pool } from "realar";

const targetValue = (ev: React.ChangeEvent<HTMLInputElement>) => ev.target.value;

const createLogic = () => {
  const email = value('').pre(targetValue);
  const password = value('').pre(targetValue);
  const form = value.combine({ email, password });

  const submit = pool(async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify(form.val)
    })
    const json = await response.json();
    // ...
  });

  const disabled = submit.pending;
  return {
    email, password, submit, disabled
  }
}

const App = () => {
  const { email, password, submit, disabled } = useLocal(createLogic);
  const values = useValues({ email, password, disabled });

  return <>
    <p><input placeholder="email" onChange={email} value={values.email} /></p>
    <p><input placeholder="password" onChange={password} value={values.password} /></p>
    <p>
      <button onClick={submit} disabled={values.disabled}>submit</button>
      {values.disabled ? "loading" : ""}
    </p>
  </>
}
```

### Basic usage

Demonstration of using different availability scopes [useLocal](./api.md#uselocal) and [shared](./api.md#shared). Simple stream usage: [signal](./api-signal.md), [map](./api-signal.md#map), [filter](./api-signal.md#filter), [to](./api-signal.md#to). And simple "store" operations: [value](./api-value.md), [pre](./api-value.md#pre), [updater](./api-value.md#updater).

[Play on codesandbox](https://codesandbox.io/s/realar-basic-example-41vvd?file=/src/App.tsx).

```javascript
import { value, signal, useValue, useLocal, useShared, shared } from "realar";

const counterLogic = () => {
  const count = value(0);
  const inc = count.updater((state) => state + 1);
  const add = count.updater((state, num: number) => state + num);

  return { count, inc, add };
};

const formLogic = () => {
  const { add } = shared(counterLogic);

  const addendum = value("0").pre(
    (ev: React.ChangeEvent<HTMLInputElement>) => ev.target.value
  );
  const sum = signal()
    .map(() => +addendum.val)
    .filter()
    .to(add);

  return { addendum, sum };
};

const Form = () => {
  const { addendum, sum } = useLocal(formLogic);
  const addendumState = useValue(addendum);
  return (
    <p>
      <input value={addendumState} onChange={addendum} />
      <button onClick={sum}>sum</button>
    </p>
  );
};

const Counter = () => {
  const { count, inc } = useShared(counterLogic);
  const countState = useValue(count);
  return (
    <p>
      {countState}
      <button onClick={inc}>inc</button>
    </p>
  );
};

export const App = () => (
  <>
    <Counter />
    <Form />
    <Counter />
    <Form />
  </>
);

```




