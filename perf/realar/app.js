import React, { useCallback, useRef, useState } from "react";
import { unit2, next_tick_print_graph } from "realar";

export {
  App
}

const u_unit = unit2({
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
	constructor(c, u1, u2) {
		this.u1 = u1;
		this.u2 = u2;
		this.c = c || 0;
	},
	expression() {
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

const runner = unit2({
  a: null, //null,
  z: null,
  inp: 0,
  out: 0,
  tick() {
    this.inp += 1;
  },
  constructor() {
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

    // console.log("RES", res);
    this.a = res[0][0];
    this.z = res[m * 2][0];
  },
  expression() {
    this.a.x1 = this.inp;
    this.out = this.z.x3;
  }
});

function App() {
  const box = useRef();
  if (!box.current) {
    let time = Date.now();
    let inst = runner();
    let init_time = Date.now() - time;

    // next_tick_print_graph();
    box.current = { inst, init_time, tick_time: 0 };
  }

  const { inst, init_time, tick_time } = box.current;
  const { inp, out, tick } = inst;

  const [ i, sync ] = useState(0);
  const click = useCallback(() => {
    let time = Date.now();
    tick();
    box.current.tick_time = Date.now() - time;
    sync(i => i + 1);
    // next_tick_print_graph();
  }, [tick]);

	return (
    <>
      <h3>Realar performance test</h3>
      <p>Iter: {i}</p>
      <p>Input: {inp}</p>
      <p>Output: {out}</p>
      <p><button onClick={click}>tick</button> {tick_time} ms</p>
      <p>Init time {init_time} ms</p>
    </>
	);
}
