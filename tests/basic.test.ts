import { box, sel, reaction } from "../src";

test("should work basic operations with box, sel and reaction", () => {
  const spy = jest.fn();
  class A {
    @box a = 10;
    @sel get b() {
      return this.a + 1;
    }
  }
  const a = new A();
  reaction(() => a.b, spy);
  expect(spy).toBeCalledTimes(0);

  a.a += 10;
  expect(spy).toHaveBeenNthCalledWith(1, 21);
  expect(spy).toBeCalledTimes(1);
});
