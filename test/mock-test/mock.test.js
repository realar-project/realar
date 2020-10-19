import { mock } from "realar";
import { notifier, api, user_form } from "./user-form";

test("User form should work", async () => {
  const notifier_mock = mock(notifier);
  const api_mock = mock(api);

  const form = user_form("a", "b");

  api_mock.user_save.mockResolvedValue(0);

  await form.save();
  expect(notifier_mock.fail).toHaveBeenCalled();
  expect(api_mock.user_save).toHaveBeenCalledWith("a", "b");
});
