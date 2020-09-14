### Quick Start

[Quick Start](./quick-start.md) / [Next steps](./quick-start-next.md) / **Final improvements**

We can use our `Like` button on any quantity of page objects but when our page started we are making one query to remote backend for each `Like` button. For example, if we have 15 `Like` buttons on the page we are making 15 queries to remove backend on page starting.

For resolve that serious defect, we need collect all `id` for we need to load, and get it all by one remote query.

```javascript
// ./like-loader-service.js
import { unit } from "realar";
import axios from "axios";

export const LikeLoaderService = unit({
  collection: null,

  delayedRequest: null,
  makeDelayedRequest() {
    this.collection = [];
    this.delayedRequest = new Promise(resove => setTimeout(resolve))
      .then(() => axios.get("/api/likes", {
        params: {
          collection: this.collection
        }
      }))
      .then(response => response.data);

    this.delayedRequest.finally(() => {
      this.delayedRequest = null;
    });
  },

  async load(id) {
    if (!this.delayedRequest) {
      this.makeDelayedRequest();
    }
    this.collection.push(id);
    const data = await this.delayedRequest;
    return data[id];
  }
});
```

```javascript
// ./like-unit.js
import { unit, service } from "realar";
import axios from "axios";
import { LikeLoaderService } from "./like-unit";

export const LikeUnit = unit({
  loader: service(LikeLoaderService),

  id: null,
  likes: null,

  async like() {
    this.likes = (await axios.put(`/api/like/${this.id}`)).data;
  },
  async load() {
    this.likes = await this.loader.load(this.id);
  },

  get loading() {
    return this.load.pending || this.like.pending;
  },

  constructor(id) {
    this.id = id;
    this.load();
  }
});
```


```javascript
// ./like.jsx
import React from "react";
import { useUnit } from "realar";

const Like = ({ id }) => {
  const { like, likes, loading } = useUnit(LikeUnit, id);

  return (
    <div>
      <button onClick={like} disabled={loading}>👍</button>
      <span>{likes}</span>
    </div>
  )
}
```

See [full code of this](https://github.com/realar-project/realar-quick-start-like-example-3) on github.

---
[] Add example of LikeButton with limit prop, and user prop. Full example better to make on (next.js or firebase, think about It). user pass throught url params.
