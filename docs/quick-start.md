### Quck Start

This example very briefly illustrates the `unit` concept of Realar:

```javascript
import React from "react";
import { unit, useUnit } from "realar";
import axios from "axios";

const LikeUnit = unit({
  likes: null,

  async like() {
    const { data } = await axios.post("/api/like");
    this.likes = data;
  },
  async fetch() {
    const { data } = await axios.get("/api/likes");
    this.likes = data;
  },

  get loading() {
    return this.fetch.proc || this.like.proc;
  },

  constructor() {
    this.fetch();
  }
});

const Like = () => {
  const { like, likes, loading } = useUnit(LikeUnit);

  return (
    <div>
      <button onClick={like} disabled={loading}>
        👍
      </button>
      <span>{likes}</span>
    </div>
  )
}
```

See [full code of this](https://github.com/realar-project/realar-quick-start-like-example) on github.















