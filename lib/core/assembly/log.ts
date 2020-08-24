export {
  log_0,
  log_1,
  log_2,
  log_3,
  log_4
}

@external("env", "log")
declare function log_0(msg: string): void;

@external("env", "log")
declare function log_1(msg: string, v1: i32): void;

@external("env", "log")
declare function log_2(msg: string, v1: i32, v2: i32): void;

@external("env", "log")
declare function log_3(msg: string, v1: i32, v2: i32, v3: i32): void;

@external("env", "log")
declare function log_4(msg: string, v1: i32, v2: i32, v3: i32, v4: i32): void;
