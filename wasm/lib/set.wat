# define SET_ELM_SIZE 4
# define SET_HEAD_SIZE 4

;; Set memory struct (i32 numbers)
;; 0 - size
;; [1..size) - ordered set of unsigned i32

(func $set_create (result i32)
  # $seq_id_next() << 7 ;; Each set 128 bytes by default
)

(func $set_add (param $id i32) (param $n i32)
  (local $size i32)
  (local $i i32)
  (local $i_n i32)
  # $size = $set_size($id)
  # $i = $set_search($id, $n)
  (if
    # $i == $size
    (then
      # $set_insert_i($id, $i, $n)
    )
    (else
      # $i_n = $set_get_i($id, $i)
      (if
        # $n != $i_n
        (then
          # $set_insert_i($id, $i, $n)
        )
      )
    )
  )
)

(func $set_size (param $id i32) (result i32)
  # [$id]
)

(func $set_insert_i (param $id i32) (param $index i32) (param $n i32)
  (local $size i32)
  (local $offset i32)
  (local $offset_index i32)

  # $size = $set_size($id)
  (if
    # $index == $size
    (then
      # [$set_offset_i($id, $index)] = $n
      # [$id] = $size + 1
      ;; finish
    )
    (else
      # $offset_index = $set_offset_i($id, $index)
      # $offset = $set_offset_i($id, $size - 1)
      (loop $loop
        # [$offset + SET_ELM_SIZE] = [$offset]
        (if
          # $offset != $offset_index
          (then
            # $offset = $offset - SET_ELM_SIZE
            (br $loop)
          )
          ;; else break
        )
        # [$offset_index] = $n
        # [$id] = $size + 1
      )
    )
  )
)

(func $set_delete_i (param $id i32) (param $index i32)
  (local $size i32)
  (local $curr i32)
  (local $to i32)
  # $size = $set_size($id)
  (if
    # $size != 1
    (then
      # $curr = $set_offset_i($id, $index)
      # $to = $set_offset_i($id, $size - 1)
      (if
        # $curr != $to
        (then
          (loop $loop
            # [$curr] = [$curr + SET_ELM_SIZE]
            (if
              # $curr + SET_ELM_SIZE != $to
              (then
                # $curr = $curr + SET_ELM_SIZE
                (br $loop)
              )
              ;; else break
            )
          )
        )
      )
    )
  )
  # [$id] = $size - 1
)

(func $set_offset_i (param $id i32) (param $index i32) (result i32)
  # $id + SET_HEAD_SIZE + ($index << 2)
)

(func $set_get_i (param $id i32) (param $index i32) (result i32)
  # [$set_offset_i($id, $index)]
)

(func $set_search (param $id i32) (param $n i32) (result i32)
  (local $size i32) (local $offset i32) (local $a i32) (local $b i32)
  (local $half i32) (local $half_index i32) (local $half_n i32) (local $res i32)

  # $size = $set_size($id)
  # $offset = 0
  (if
    # !$size ;; $size == 0
    (then
      # $res = 0
    )
    (else
      (loop $loop
        # $b = $size >> 1 ;; $size / 2
        # $a = $size - $b

        ;; left:$a:(+1-0) | right:$b
        # $half = $offset + $a
        # $half_index = $half - 1
        # $half_n = $set_get_i($id, $half_index)
        (if
          # $n > $half_n
          (then
            (if
              # !$b ;; $b == 0
              (then
                # $res = $half
                ;; break
              )
              (else
                # $offset = $offset + $a
                (br $loop)
              )
            )
          )
          (else
            (if
              # $n != $half_n
              (then
                (if
                  # $size == 1
                  (then
                    # $res = $half_index
                    ;; break
                  )
                  (else
                    # $size = $a
                    (br $loop)
                  )
                )
              )
              (else
                # $res = $half_index
                ;; break
              )
            )
          )
        )
      )
    )
  )
  # $res
)

(func $set_has (param $id i32) (param $n i32) (result i32)
  (local $size i32)
  (local $i i32)
  (local $i_n i32)
  (local $res i32)
  # $size = $set_size($id)
  (if
    # !$size ;; $size == 0
    (then
      # $res = 0
    )
    (else
      # $i = $set_search($id, $n)
      (if
        # $i == $size
        (then
          # $res = 0
        )
        (else
          # $i_n = $set_get_i($id, $i)
          (if
            # $n == $i_n
            (then
              # $res = 1
            )
            (else
              # $res = 0
            )
          )
        )
      )
    )
  )
  # $res
)

(func $set_delete (param $id i32) (param $n i32) (result i32)
  (local $size i32)
  (local $i i32)
  (local $i_n i32)
  (local $res i32)
  # $size = $set_size($id)
  (if
    # !$size ;; $size == 0
    (then
      # $res = 0
    )
    (else
      # $i = $set_search($id, $n)
      (if
        # $i == $size
        (then
          # $res = 0
        )
        (else
          # $i_n = $set_get_i($id, $i)
          (if
            # $n != $i_n
            (then
              # $res = 0
            )
            (else
              # $set_delete_i($id, $i)
              # $res = 1
            )
          )
        )
      )
    )
  )
  # $res
)

(func $set_free (param $id i32) (result i32)
  # 0
)

(export "set_create" (func $set_create))
(export "set_add" (func $set_add))
(export "set_has" (func $set_has))
(export "set_delete" (func $set_delete))
(export "set_size" (func $set_size))
(export "set_free" (func $set_free))
