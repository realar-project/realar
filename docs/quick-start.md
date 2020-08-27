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
  async fetch() {
    this.likes = (await axios.get("/api/likes")).data;
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
      <button onClick={like} disabled={loading}>👍</button>
      <span>{likes}</span>
    </div>
  )
}
```

See [full code of this](https://github.com/realar-project/realar-quick-start-like-example) on github.





After understending all previous example terms, we can make small emprovements. We will add unique key to `Like` button. This key will be used for all remote queries. In result we can use this button for any quantity objects on the page who has like button.

```javascript
import React from "react";
import { unit, useUnit } from "realar";
import axios from "axios";

const LikeUnit = unit({
  id: null,
  likes: null,

  async like() {
    this.likes = (await axios.put(`/api/like/${this.id}`)).data;
  },
  async fetch() {
    this.likes = (await axios.get(`/api/likes/${this.id}`)).data;
  },

  get loading() {
    return this.fetch.proc || this.like.proc;
  },

  constructor(id) {
    this.id = id;
    this.fetch();
  }
});

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



---
Todo:
[] Make animated gif with process of work this example, for understanding without external repo download and install.













