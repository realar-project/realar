import { start, pop, push } from "./slice";
import {
  box_value_create,
  box_value_get_phase,
  box_value_set_phase,
  box_expr_create,
  box_expr_start,
  box_expr_finish,
  box_computed_create,
  box_computed_start,
  box_computed_finish,
  box_entry_start,
  box_entry_finish,
  box_collection_start,
  box_collection_finish,
  box_collection_free,
  box_free
} from "./box";

export {
  start as s,
  pop as o,
  push as u
}
export {
  box_value_create as a0,
  box_value_get_phase as a1,
  box_value_set_phase as a2,
  box_expr_create as a3,
  box_expr_start as a4,
  box_expr_finish as a5,
  box_computed_create as a6,
  box_computed_start as a7,
  box_computed_finish as a8,
  box_entry_start as a9,
  box_entry_finish as aa,
  box_collection_start as ab,
  box_collection_finish as ac,
  box_collection_free as ad,
  box_free as ae
}

