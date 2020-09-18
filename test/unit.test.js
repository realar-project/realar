import { unit, pending, on, effect } from "../lib";

const u = unit({
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

test("should work unit inst with expression", () => {
  const inst = u(5);
  let { v, v2, n, v3, m } = inst;

  expect(v).toBe(1);
  expect(v2).toBe(3);
  expect(n).toBe(2);
  expect(v3).toBe(5);
  expect(m(1)).toBe(11);

  inst.v = 10;
  expect(m(1)).toBe(38);
  inst.v = 9;
  expect(m(1)).toBe(35);
});

test("should work unit computed", () => {
  const sum_spy = jest.fn();
  const u_factory = unit({
    a: 10,
    b: 11,
    get sum() {
      sum_spy();
      return this.a + this.b;
    }
  });

  const u = u_factory();

  expect(u.sum).toBe(21);
  expect(sum_spy).toHaveBeenCalledTimes(1);
  expect(u.sum).toBe(21);
  expect(u.sum).toBe(21);
  expect(sum_spy).toHaveBeenCalledTimes(1);

  u.a = 12;
  expect(u.sum).toBe(23);
  expect(u.sum).toBe(23);
  expect(sum_spy).toHaveBeenCalledTimes(2);

  u.b = 15;
  expect(u.sum).toBe(27);
  expect(u.sum).toBe(27);
  expect(sum_spy).toHaveBeenCalledTimes(3);
});

test("should work unit composition", () => {
  const u_1 = unit({
    inp: 1,
    out: 10,
    constructor(inp) {
      if (inp) {
        this.inp = inp;
      }
    },
    expression() {
      this.out = this.inp * 10;
    }
  });

  const u_2 = unit({
    a: u_1(),
    b: u_1(),
    c: null,
    out: 0,
    constructor() {
      this.c = u_1(100);
    },
    expression() {
      this.out = this.a.out + this.b.out + this.c.out;
    },
    inp(a, b, c) {
      this.a.inp = a;
      this.b.inp = b;
      this.c.inp = c;
    }
  })

  const u_3 = unit({
    u: null,
    out: null,
    constructor(u) {
      this.u = u;
    },
    expression() {
      this.out = this.u.out + 1
    },
    get o() {
      return this.out + 1;
    }
  });

  const i = u_2();
  const p = u_3(i);
  expect(i.out).toBe(1020);
  expect(p.o).toBe(1022);
  i.inp(5, 10, 1);
  expect(i.out).toBe(160);
  expect(p.o).toBe(162);
  i.inp(50, 100, 10);
  expect(i.out).toBe(1600);
  expect(p.o).toBe(1602);
});

test("should throw digest loop limit exception", () => {
  const u = unit({
    u: null,
    a: 0,
    b: 0,
    expression() {
      if (this.u) {
        this.a = this.u.b
      }
      this.b = this.a;
      if (this.u) {
        this.u.a = Math.random();
      }
    },
  });

  expect(() => {
    const i = u();
    i.u = u();
  }).toThrow("Limit digest loop iteration");
});

test("should throw exception on special unit methods manual call", () => {
  const u_1 = unit({
    m() { this.constructor() }
  });
  const u_2 = unit({
    m() { this.destructor() }
  });
  const u_3 = unit({
    m() { this.expression() }
  });

  expect(() => u_1().m()).toThrow("Hello 1");
  expect(() => u_2().m()).toThrow("Hello 1");
  expect(() => u_3().m()).toThrow("Hello 1");
});

test("should throw exception on pending call for non pendingable functions", () => {
  const f = () => {};
  const f_1 = () => new Promise();

  const u = unit({
    async m() { }
  });

  expect(() => pending(f)).toThrow("Hello 1");
  expect(() => pending(f_1)).toThrow("Hello 1");
  expect(pending(u().m)).toBe(false);
});

test("should throw exception on call effect or on functions outside of constructor", () => {
  const u_1 = unit({
    m() { on(); }
  });
  const u_2 = unit({
    m() { effect(); }
  });

  expect(() => u_1().m()).toThrow("Hello 1");
  expect(() => u_2().m()).toThrow("Hello 1");
});
