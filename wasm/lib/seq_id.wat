# define SEQ_ID_ADR 4

(func $seq_id_init
  ;; TODO: Replace to data section with initial values
  # [SEQ_ID_ADR] = 0
)

(func $seq_id_next (result i32)
  (local $id i32)
  # $id = [SEQ_ID_ADR] + 1
  # [SEQ_ID_ADR] = $id
  # $id
)

(export "seq_id_init" (func $seq_id_init))
