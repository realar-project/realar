### Quck Start

This example briefly illustrates the `unit` concept of Realar:

```javascript
import React from "react";
import { unit, useUnit } from "realar";
import axios from "axios";

const LikeUnit = unit({
  likes: null,

  async like() {
    this.likes = (await axios.post("/api/like")).data;
  },
  async load() {
    this.likes = (await axios.get("/api/likes")).data;
  },

  get loading() {
    return this.load.pending || this.like.pending;
  },

  constructor() {
    this.load();
  }
});

const Like = () => {
  const { like, likes, loading } = useUnit(LikeUnit);

  return (
    <div>
      <button onClick={like} disabled={loading}>👍</button>
      <span>{likes}</span>
    </div>
  )
}
```

See [full code of this](https://github.com/realar-project/realar-quick-start-like-example-1) on github.

---
Todo:
[] Make animated gif with process of work this example, for understanding without external repo download and install.

---

[Lets go to next steps of our quick start guide](./quick-start-next.md).








