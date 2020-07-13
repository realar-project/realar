import { preprocess } from "../preprocess";

test("should work", () => {
  let code = `
  # define SEQ_ID_ADR 4
  # import set
  # define CONST 10
  (some start)
  # $i = 30
  # <debug>
  (some code)
  # $i = 10
  # </debug>
  # <debug>
  # $i = 11
  # </debug>
  # $i = ($k + 11) * 2 + 1
  # $i = $m(1 + 2, 10)
  # [$i] = [10] << $a(CONST) + $m(1 + 2, 10)
  # $size = [$id]
  (some finish)
  # [SEQ_ID_ADR] = 0
  # $id
  # $id = $seq_id_next() << 7 + 128 ;; Each set 128 bytes by default
  # $i == $size
  # 5 != U
  # $offset = $set_offset_i($id, $size - 1)
  # [$offset + 4] = [$offset]
  # !$size
  # $b = $size >> 1
  # $n > get_i($half_index)
  # 5 < 1
  (if 5 < 1
    (then [$i] = 5)
    (else
      10
      5
    )
  )
  `;

  expect(preprocess(code, __dirname)).toMatchSnapshot();
});
