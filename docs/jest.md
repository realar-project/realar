### Jest unit test usage :yum:

```javascript
import { mock } from "realar";
import { Notifier, Api, UserForm } from "./user-form";

test("User form should work", async () => {
  const notifierMock = mock(Notifier);
  const apiMock = mock(Api);

  const form = UserForm("a", "b");

  apiMock.userSave.mockResolvedValue(0);

  await form.save();
  expect(notifierMock.fail).toHaveBeenCalled();
  expect(apiMock.userSave).toHaveBeenCalledWith("a", "b");
});
```
Code of [./user-form.js](./jest-user-form.md)

And Your Jest config file

```javascript
// jest.config.json
{
  "setupFilesAfterEnv": [
    "realar/jest"
  ]
}
```

You can see full Jest unit test example on github [realar-project/realar-jest](https://github.com/realar-project/realar-jest).
