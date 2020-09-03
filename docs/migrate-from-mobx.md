### Migrate from Mobx


```javascript
// ./current-user-service.js
export class CurrentUserService {
  @observable.ref user = {};
  @observable.ref logined = false;

  @computed get userName() {
    const { user } = this;
    if (!user.id) return "";
    return `${user.firstName} ${user.lastName}`;
  }

  @action.bound userLogined(user) {
    this.user = user;
    this.logined = true;
  }
  @action.bound userLogouted() {
    this.user = {};
    this.logined = false;
  }
}
```

Using of `CurrentUserService` class is using of usual javascript class.

```javascript
// ./current-user-service.js
import { CurrentUserService } from "./current-user-service";

export const currentUserService = new CurrentUserService();
```

I immidiately show same code in realar syntax.

```javascript
// ./current-user-service.js
export const CurrentUserService = unit({
  user = {},
  logined = false,

  get userName() {
    const { user } = this;
    if (!user.id) return "";
    return `${user.firstName} ${user.lastName}`;
  },

  userLogined(user) {
    this.user = user;
    this.logined = true;
  },
  userLogouted() {
    this.user = {};
    this.logined = false;
  }
});
```

Using of this `CurrentUserService` user as usual javascript class of function factory, both syntax in possible.

```javascript
// ./current-user-service.js
import { CurrentUserService } from "./current-user-service";

export const currentUserService = new CurrentUserService();
/*
  // Using in function factory syntax
  export const currentUserService = CurrentUserService();
*/
```




