(module
  (import "env" "memory" (memory 1))

  ;; TODO: for a first I need to do one simple set in one block of linear memory

  (func $set_create (result i32)
    i32.const 2)
  (func $set_add (param $id i32) (param $n i32) (result i32)
    local.get $id
    local.get $n
    i32.add)
  (func $set_has (param $id i32) (param $n i32) (result i32)
    local.get $id
    local.get $n
    i32.add)
  (func $set_delete (param $id i32) (param $n i32) (result i32)
    local.get $id
    local.get $n
    i32.add)
  (func $set_extract (param $id i32) (result i32)
    local.get $id
    local.get $id
    i32.add)
  (func $set_free (param $id i32) (result i32)
    local.get $id
    local.get $id
    i32.add)

  (export "set_create" (func $set_create))
  (export "set_add" (func $set_add))
  (export "set_has" (func $set_has))
  (export "set_delete" (func $set_delete))
  (export "set_extract" (func $set_extract))
  (export "set_free" (func $set_free))
)
