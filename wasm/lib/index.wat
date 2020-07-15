(module
  (import "env" "memory" (memory 1))

  ## import debug
  ## import seq_id
  ## import set

  (export "seq_id_init" (func $seq_id_init))

  (export "set_create" (func $set_create))
  (export "set_add" (func $set_add))
  (export "set_has" (func $set_has))
  (export "set_delete" (func $set_delete))
  (export "set_size" (func $set_size))
  (export "set_free" (func $set_free))
)
