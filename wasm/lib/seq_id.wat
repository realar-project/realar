## define SEQ_ID_ADR 4

func seq_id_init
  # TODO: Replace to data section with initial values
  [SEQ_ID_ADR] = 0

func seq_id_next result
  local id
  id = [SEQ_ID_ADR] + 1
  [SEQ_ID_ADR] = id
  id

