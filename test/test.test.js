import { unit, shared, mock } from "realar";

const s = unit({
  v: 1,
  m() {}
});

const u = unit({
  s: shared(s),
  v: 0,
  m: () => this.s.m(this.v)
});

test("should use different shared instances A", () => {
  const inst = u();
  const serv = shared(s);
  expect(serv.v).toBe(1);
  serv.v = 10;
  expect(inst.s.v).toBe(10);
});

// TODO: scope should destroy
// test("should use different shared instances B", () => {
//   const inst = u();
//   const serv = shared(s);
//   expect(serv.v).toBe(1);
//   serv.v = 10;
//   expect(inst.s.v).toBe(10);
// });

// TODO:
// test("should work mock", () => {
//   const mocked_s = mock(s);
//   const inst = u();
//   expect(mocked_s.m).toHaveBeenCalledTimes(0);
//   inst.v = 10;
//   inst.m();
//   expect(mocked_s.m).toHaveBeenCalledTimes(1);
//   expect(mocked_s.m).toHaveBeenCalledWith(10);
// });
