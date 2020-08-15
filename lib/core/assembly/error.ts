const
  TICK_DEEP_LIMIT_EXCEPTION: i32 = 1,
  DIGEST_LOOP_LIMIT_EXCEPTION: i32 = 2;


export {
  error,
  TICK_DEEP_LIMIT_EXCEPTION,
  DIGEST_LOOP_LIMIT_EXCEPTION
}


@external("env", "error")
declare function error(code: i32): void
