import React, { useCallback, useRef } from "react";
import { unit, useUnit, Zone } from "../build";

export {
  App
}

const u_unit = unit({
	u1: null,
	u2: null,
	c: 0,
	x1: 0, // input
	x2: 66,
	x3: 0, // output
	get c1() {
		return this.x1 + this.x2 + 17 + this.c;
	},
	get c2() {
		return this.x2 + 5 + this.c1;
	},
	get c3() {
		return this.c2 + this.c1 + this.x2 + this.c;
	},
	m1(x) {
		return this.c3 + this.c2 + this.c1 + this.x1 + this.x2 + x;
	},
	m2(x) {
		return this.m1(x) + this.c2;
	},
	construct(c, u1, u2) {
		this.u1 = u1;
		this.u2 = u2;
		this.c = c || 0;
	},
	synchronize() {
    let x3 = this.m2(this.x1);
		if (this.u1) {
			x3 += this.u1.x3;
		}
		if (this.u2) {
			x3 += this.u2.x3;
    }
    this.x3 = x3;
	}
});

const runner = unit({
  a: null, //null,
  z: null,
  inp: 0,
  out: 0,
  init_time: 0,
  tick() {
    this.inp += 1;
  },
  construct() {
    let time = Date.now();

    let m = 10;
    let i, k, d;
    let w = 1;
    let res = [[u_unit(w)]];
    let curr = 0;
    let next_curr;
    for (d = 0; d < m; d++) {
      next_curr = curr + 1;
      res[next_curr] = [];
      w = w * 2;

      for(i = 0; i < w; i++) {
        k = (i - i % 2) / 2;
        res[next_curr].push(u_unit(w + i, res[curr][k]));
      }
      curr = next_curr;
    }

    let u = w;
    for (d = 0; d < m; d++) {
      next_curr = curr + 1;
      res[next_curr] = [];

      w = w / 2;
      for(i = 0; i < w; i++) {
        k = i * 2;
        res[next_curr].push(u_unit(u + i, res[curr][k], res[curr][k + 1]));
      }
      curr = next_curr;
      u += w;
    }

    this.a = res[0][0];
    this.z = res[m * 2][0];
    this.init_time = Date.now() - time;
  },
  synchronize() {
    this.a.x1 = this.inp;
    this.out = this.z.x3;
  }
});

function App() {
  const { inp, out, tick, init_time } = useUnit(runner);

  let time = 0;
  const timestamp = useRef();
  const start = useCallback(() => {
    timestamp.current = Date.now();
    tick();
  }, []);

  if (timestamp.current) {
    time = Date.now() - timestamp.current;
  }

	return (
    <Zone>
      <h3>Realar performance test</h3>
      <p>Input: {inp}</p>
      <p>Output: {out}</p>
      <p><button onClick={start}>tick</button> {time} ms</p>
      <p>Init time {init_time} ms</p>
    </Zone>
	);
}

