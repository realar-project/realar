import { signal, signal_listen, signal_key } from "../lib/signal";

test("should fix: signal run twice for same value", () => {
  const s = signal(1);
  const spy = jest.fn();
  signal_listen(s[signal_key], spy);

  s(1);
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenLastCalledWith(1);

  s(1, "b");
  s(1, "b");
  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy).toHaveBeenLastCalledWith(1, "b");

  s("b", "b");
  expect(spy).toHaveBeenLastCalledWith("b", "b");
});
