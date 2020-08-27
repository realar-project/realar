### Quck Start

This example very briefly illustrates the `unit` concept of Realar:

```javascript
import React from "react";
import { unit, useUnit } from "realar";

const likeUnit = unit({
  likes: null,

  get loading() {
    return this.fetch.proc || this.like.proc;
  },

  async like() {
    const { data } = await axios.get("/api/like");
    this.likes = data;
  },
  async fetch() {
    const { data } = await axios.get("/api/likes");
    this.likes = data;
  },

  constructor() {
    this.fetch();
  }
});

const Like = () => {
  const { like, likes, loading } = useUnit(likeUnit);

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
