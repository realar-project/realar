### Migrate from Redux


```javascript
// ./store.js
import { unit } from "realar";
import { AuthStore } from "./auth-store";
import { CurrentUserStore } from "./current-user-store";
// import { LoginFormStore } from "./login-form-store";

export const Store = unit({
  currentUser: CurrentUserStore(),
  // loginForm: LoginFormStore(),
});
```

```javascript
// ./App.jsx
import React from "react";
import { Login } from "./login";

export const App = () => (
  <Login />
);
```

```javascript
// ./login-events.js
import { event } from "realar";

export const UserLogined = event();
export const UserLogouted = event();
```

```javascript
// ./current-user-store.js
import { unit } from "realar";
import { UserLogined, UserLogouted } from "./login-events";

export const CurrentUserStore = unit({
  user: {
    id: null,
    firstName: null,
    lastName: null,
  },
  logined: false,

  get selectUserName() {
    const { user } = this;
    if (!user.id) return "";
    return `${user.firstName} ${user.lastName}`;
  },

  [UserLogined](user) {
    this.user = user;
    this.logined = true;
  },
  [UserLogouted]() {
    this.user = {};
    this.logined = false;
  },
});
```

```javascript
// ./login.jsx
import React from "react";
import { useService } from "realar":
import { Store } from "./store";
import { UserLogouted } from "./login-events";
import { LoginForm } from "./login-form.jsx";

export const Login = () => {
  const { currentUser } = useService(Store);
  const { logined } = currentUser;
  if (logined) {
    return (
      Hi, {currentUser.selectUserName}!
      <button onClick={UserLogouted}>Logout</button>
    );
  }
  return (
    <LoginForm/>
  );
}
```

```javascript
// ./login-form.jsx
import React from "react";
import { useUnit } from "realar":
import { LoginFormUnit } from "./login-form-unit";

export const LoginForm = () => {
  const form = useUnit(LoginFormUnit);
  return (
    <form onSubmit={form.submit}>
      <label>
        First name:
        <input type="text" value={form.firstName} onChange={form.changeFirstName} />
      </label>
      <label>
        Last name:
        <input type="text" value={form.lastName} onChange={form.changeLastName} />
      </label>
      <input type="submit" value="Login" />
    </form>
  );
}
```

```javascript
// ./login-form-unit.js
import { unit } from "realar";
import { UserLogined } from "./login-events";

export const LoginFormUnit = unit({
  firstName: "",
  lastName: "",

  changeFirstName(event) {
    this.firstName = event.target.value;
  },
  changeLastName(event) {
    this.lastName = event.target.value;
  },

  submit(event) {
    event.preventDefault();

    UserLogined({
      id: 1,
      firstName: this.firstName,
      lastName: this.lastName
    });
  },
});
```









