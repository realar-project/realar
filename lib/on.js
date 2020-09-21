import { action_key, action_listen } from "./action";
import { signal_key, signal_listen } from "./signal";
import { call_key, call_listen } from "./call";

const
  test_on_action_incorrect = `Only action, signal and call supported as first argument for "on" function`,
  test_on_func_incorrect = `Only function supported as second argument for "on" function`;

export {
  on
}

function on(action, fn) {
  if (!action) {
    throw new Error(test_on_action_incorrect);
  }
  if (!fn || !(fn instanceof Function)) {
    throw new Error(test_on_func_incorrect);
  }
  if (action[action_key]) {
    action_listen(action[action_key], fn);
  }
  else if (action[signal_key]) {
    signal_listen(action[signal_key], fn);
  }
  else if (action[call_key]) {
    call_listen(action[call_key], fn);
  } else {
    throw new Error(test_on_action_incorrect);
  }
}
