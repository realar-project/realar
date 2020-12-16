import { box, sel, reaction } from "realar";

test("should work", () => {
  const spy = jest.fn();
  class A {
    @box a = 10;
    @sel get b() {
      return this.a + 1;
    }
  }
  const a = new A();
  reaction(() => a.b, spy);
  expect(spy).toHaveBeenNthCalledWith(1, 11);

  a.a += 10;
  expect(spy).toHaveBeenNthCalledWith(2, 21);
});
