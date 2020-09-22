import { signal, signal_listen, signal_key } from "../lib/signal";

test("should fix: signal run twice for same value", () => {
  const s = signal(1);
  const spy = jest.fn();
  signal_listen(s[signal_key], spy);

  s(1);
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenLastCalledWith(1);

  s(10);
  s(10);
  expect(spy).toHaveBeenCalledTimes(2);
  expect(spy).toHaveBeenLastCalledWith(10);

  s("b");
  expect(spy).toHaveBeenLastCalledWith("b");
});
