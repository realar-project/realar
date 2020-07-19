import { unit, service } from "../../lib";

// Some real notifier service
export const notifier = unit({
  ok: () => console.log("ok"),
  fail: () => console.log("fail"),
})

// Some real external api gateway service
export const api = unit({
  async user_save(username, password) {
    // Some real post remote request to api
    await new Promise(r => setTimeout(r, 1000));
    console.log(username, password);
    return 1;
  }
})

export const user_form = unit({
  notifier: service(notifier),
  api: service(api),

  username: '',
  password: '',
  proc: 0,

  get disabled() {
    return this.proc > 0;
  },

  construct(username, password) {
    if (username) this.username = username;
    if (password) this.password = password;
  },

  async save() {
    this.proc ++;
    const res = await this.api.user_save(this.username, this.password);
    if (res) {
      this.notifier.ok();
    }
    else {
      this.notifier.fail();
    }
    this.proc --;
    return res;
  },

});
