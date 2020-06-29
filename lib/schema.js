let
  tick_deep = 0;

export {
  schema_phase_start,
  schema_phase_finish,
  is_schema_phase
}

function schema_phase_start() {
  ++tick_deep;
}

function schema_phase_finish() {
  --tick_deep;
}

function is_schema_phase() {
  return tick_deep;
}
