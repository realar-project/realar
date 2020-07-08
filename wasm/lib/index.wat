(module
  (import "env" "memory" (memory 1))

  ;; Set memory struct (bytes)
  ;; 0 - length
  ;; [1..length) - ordered numbers of set

  (func $set_create (result i32)
    (local $id i32)
    (local.set $id (i32.const  4))
    (i32.store (local.get $id) (i32.const 0))
    local.get $id
  )
  (func $set_add (param $id i32) (param $n i32)
    (local $len i32) (local $len2 i32) (local $ptr i32)

    (local.set $len
      (i32.load (local.get $id))
    )
    (local.set $len2
      (i32.add
        (local.get $len)
        (i32.const 1)
      )
    )

    (local.set $ptr
      (i32.add
        (local.get $id)
        (i32.shl
          (local.get $len2)
          (i32.const 2)
        )
      )
    )

    (i32.store
      (local.get $ptr)
      (local.get $n)
    )

    (i32.store (local.get $id) (local.get $len2))
  )
  (func $set_has (param $id i32) (param $n i32) (result i32)
    local.get $id
    local.get $n
    i32.add)
  (func $set_delete (param $id i32) (param $n i32) (result i32)
    local.get $id
    local.get $n
    i32.add)
  (func $set_free (param $id i32) (result i32)
    local.get $id
    local.get $id
    i32.add)

  (export "set_create" (func $set_create))
  (export "set_add" (func $set_add))
  (export "set_has" (func $set_has))
  (export "set_delete" (func $set_delete))
  (export "set_free" (func $set_free))
)
