import { unit2 } from "../lib";

const u = unit2({
  v:1,
  get n() {
    return this.v + 1
  },
  expression() {
    this.v2 = this.v + this.n;
  },
  m(k, m = 5) {
    m = m + 1;
    return this.v + this.v2 + k + m;
  },
  v2: "A",
  v3: null,
  constructor(v) {
    this.v3 = v;
  }
});

test("should work unit inst", () => {
  const inst = u(5);
  let { v, v2, n, v3, m } = inst;

  expect(v).toBe(1);
  expect(v2).toBe(3);
  expect(n).toBe(2);
  expect(v3).toBe(5);
  expect(m(1)).toBe(11);
});
