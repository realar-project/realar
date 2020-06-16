# Realar

[![npm version](https://img.shields.io/npm/v/realar?style=flat-square)](https://www.npmjs.com/package/realar) [![npm bundle size](https://img.shields.io/bundlephobia/minzip/realar?style=flat-square)](https://bundlephobia.com/result?p=realar) [![build status](https://img.shields.io/github/workflow/status/betula/realar/Tests?style=flat-square)](https://github.com/betula/realar/actions?workflow=Tests) [![code coverage](https://img.shields.io/coveralls/github/betula/realar?style=flat-square)](https://coveralls.io/github/betula/realar)

My favorite React state management.

```javascript
class Counter {
	count = 0;
	inc() { this.count += 1; }
	dec() { this.count -= 1; }
}

const App = () => {
	const { count, inc, dec } = useService(Counter);
	return (
		<>
			<i>{count}</i>
			<button onClick={inc}>+</button>
			<button onClick={dec}>-</button>
		</>
	)
}
```
[This example on CodeSandbox](https://codesandbox.io/s/mystifying-mclaren-9uvsb?file=/src/App.tsx)

### Install

```bash
npm i --save realar
# or
yarn add realar
```
