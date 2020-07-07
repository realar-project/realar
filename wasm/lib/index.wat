(module
  (func $add (param $lhs1 i32) (param $rhs i32) (result i32)
    local.get $lhs1
    local.get $rhs
    i32.add)
  (export "add" (func $add))
)
