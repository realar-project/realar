import { unit, service } from "../lib";
import { mock } from "../jest";

const s = unit({
  v: 1,
  m() {}
});

const u = unit({
  s: service(s),
  v: 0,
  m: () => this.s.m(this.v)
});

test("should use different service instances A", () => {
  const inst = u();
  const serv = service(s);
  expect(serv.v).toBe(1);
  serv.v = 10;
  expect(inst.s.v).toBe(10);
});

test("should use different service instances B", () => {
  const inst = u();
  const serv = service(s);
  expect(serv.v).toBe(1);
  serv.v = 10;
  expect(inst.s.v).toBe(10);
});

test("should work mock", () => {
  const mocked_s = mock(s);
  const inst = u();
  expect(mocked_s.m).toHaveBeenCalledTimes(0);
  inst.v = 10;
  inst.m();
  expect(mocked_s.m).toHaveBeenCalledTimes(1);
  expect(mocked_s.m).toHaveBeenCalledWith(10);
})
