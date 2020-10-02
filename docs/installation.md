### Installation

The most esies way of start the [parcel bundler](https://parceljs.org/getting_started.html). Parcel has zero-configuration and possibility for add plugins to [babel config](https://babel.dev/docs/en/configuration).

```bash
npm i -D parcel-bundler
npm i -P react react-dom realar
```

Update your babel config:

```javascript
// .babelrc.js
module.exports = {
  "plugins": [
    "realar/babel"
  ]
}
```

And to wrap your `react-dom` render code, to realar `ready` function:

```javascript
import React from "react";
import { render } from "react-dom";
import { ready } from "realar";
import { App } from "./app";

ready(() => render(<App />, document.getElementById("root")));
```

Enjoy!
