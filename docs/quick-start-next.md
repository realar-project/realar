### Quck Start

[Quick Start](./quick-start.md) / **Next steps**

After understending all previous example terms, we can make small emprovements. We will add unique key to `Like` button. This key will be used for all remote backend queries. In result we can use this button for any quantity objects on the page who has like button.

```javascript
import React from "react";
import { unit, useOwn } from "realar";
import axios from "axios";

const LikeUnit = unit({
  id: null,
  likes: null,

  async like() {
    this.likes = (await axios.put(`/api/like/${this.id}`)).data;
  },
  async load() {
    this.likes = (await axios.get(`/api/likes/${this.id}`)).data;
  },

  get loading() {
    return this.load.pending || this.like.pending;
  },

  constructor(id) {
    this.id = id;
    this.load();
  }
});

const Like = ({ id }) => {
  const { like, likes, loading } = useOwn(LikeUnit, id);

  return (
    <div>
      <button onClick={like} disabled={loading}>👍</button>
      <span>{likes}</span>
    </div>
  )
}
```
See [full code of this](https://github.com/realar-project/realar-quick-start-like-example-2) on github.

If last example totally understood. We will make last improvement. [Final step of quick start guide for deep understanding](./quick-start-final.md).












