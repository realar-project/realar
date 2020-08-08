import React, { useRef, useCallback } from "react";
import { computed, observable, action, autorun } from "mobx";
import { observer } from "mobx-react";
import { useInstance } from "./use-instance";

class U {
	@observable.ref u1 = null;
	@observable.ref u2 = null;
	@observable.ref c = 0;
	@observable.ref x1 = 0; // input
	@observable.ref x2 = 66;
  @observable.ref x3 = 0; // output

	@computed get c1() {
		return this.x1 + this.x2 + 17 + this.c;
	};
	@computed get c2() {
		return this.x2 + 5 + this.c1;
	};
	@computed get c3() {
		return this.c2 + this.c1 + this.x2 + this.c;
  };

	@action.bound m1(x) {
		return this.c3 + this.c2 + this.c1 + this.x1 + this.x2 + x;
	};
	@action.bound m2(x) {
		return this.m1(x) + this.c2;
	};
	constructor(c, u1, u2) {
		this.u1 = u1;
		this.u2 = u2;
    this.c = c || 0;

    autorun(() => {
      let x3 = this.m2(this.x1);
      if (this.u1) {
        x3 += this.u1.x3;
      }
      if (this.u2) {
        x3 += this.u2.x3;
      }
      this.x3 = x3;
    });
	};
}

class Runner {
  @observable.ref a = null;
  @observable.ref z = null;
  @observable.ref inp = 0;
  @observable.ref out = 0;
  @observable.ref init_time = 0;

  @action.bound tick() {
    this.inp += 1;
  }
  constructor() {
    let time = Date.now();

    let m = 10;
    let i, k, d;
    let w = 1;
    let res = [[new U(w)]];
    let curr = 0;
    let next_curr;
    for (d = 0; d < m; d++) {
      next_curr = curr + 1;
      res[next_curr] = [];
      w = w * 2;

      for(i = 0; i < w; i++) {
        k = (i - i % 2) / 2;
        res[next_curr].push(new U(w + i, res[curr][k]));
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
        res[next_curr].push(new U(u + i, res[curr][k], res[curr][k + 1]));
      }
      curr = next_curr;
      u += w;
    }

    this.a = res[0][0];
    this.z = res[m * 2][0];
    this.init_time = Date.now() - time;

    autorun(() => {
      this.a.x1 = this.inp;
      this.out = this.z.x3;
    });
  }
}

export const App = observer(() => {
  const { inp, out, tick, init_time } = useInstance(Runner);

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
    <>
      <h3>Mobx performance test</h3>
      <p>Input: {inp}</p>
      <p>Output: {out}</p>
      <p><button onClick={start}>tick</button> {time} ms</p>
      <p>Init time {init_time} ms</p>
    </>
	);
});
