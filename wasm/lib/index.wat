(module
  # <debug>
  (import "env" "log_i32" (func $log_i32_1 (param i32)))
  (import "env" "log_i32" (func $log_i32_2 (param i32 i32)))
  (import "env" "log_i32" (func $log_i32_3 (param i32 i32 i32)))
  (import "env" "log_i32" (func $log_i32_4 (param i32 i32 i32 i32)))
  # </debug>
  (import "env" "memory" (memory 1))

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
    ;; $size = size(id)
    ;; (local.set $size
    ;;   (call $set_size
    ;;     (local.get $id)
    ;;   )
    ;; )
    # $i = $set_search($id, $n)
    ;; $i = search($id, $n)
    ;; (local.set $i
    ;;   (call $set_search
    ;;     (local.get $id)
    ;;     (local.get $n)
    ;;   )
    ;; )
    ;; if $i == $size
    (if
      # $i == $size
      ;; (i32.eq
      ;;   (local.get $i)
      ;;   (local.get $size)
      ;; )
      (then
        # $set_insert_i($id, $i, $n)
        ;; insert($i, $n)
        ;; (call $set_insert_i
        ;;   (local.get $id)
        ;;   (local.get $i)
        ;;   (local.get $n)
        ;; )
      )
      (else
        # $i_n = $set_get_i($id, $i)
        ;; $i_n = get_i($i)
        ;; (local.set $i_n
        ;;   (call $set_get_i
        ;;     (local.get $id)
        ;;     (local.get $i)
        ;;   )
        ;; )
        ;; if $n != $i_n
        (if
          # $n != $i_n
          ;; (i32.ne
          ;;   (local.get $n)
          ;;   (local.get $i_n)
          ;; )
          (then
            # $set_insert_i($id, $i, $n)
            ;; insert($i, $n)
            ;; (call $set_insert_i
            ;;   (local.get $id)
            ;;   (local.get $i)
            ;;   (local.get $n)
            ;; )
          )
        )
      )
    )
  )

  (func $set_size (param $id i32) (result i32)
    # [$id]
    ;; (i32.load
    ;;   (local.get $id)
    ;; )
  )

  (func $set_insert_i (param $id i32) (param $index i32) (param $n i32)
    (local $size i32)
    (local $offset i32)
    (local $offset_index i32)

    # $size = $set_size($id)
    ;; $size = size(id)
    ;; (local.set $size
    ;;   (call $set_size
    ;;     (local.get $id)
    ;;   )
    ;; )
    ;; if $index == $size
    (if
      # $index == $size
      ;; (i32.eq
      ;;   (local.get $index)
      ;;   (local.get $size)
      ;; )
      (then
        # [$set_offset_i($id, $index)] = $n
        ;; $mem[$index] = $n
        ;; (i32.store
        ;;   (call $set_offset_i
        ;;     (local.get $id)
        ;;     (local.get $index)
        ;;   )
        ;;   (local.get $n)
        ;; )
        # [$id] = $size + 1
        ;; $size = $size + 1
        ;; (i32.store
        ;;   (local.get $id)
        ;;   (i32.add
        ;;     (local.get $size)
        ;;     (i32.const 1)
        ;;   )
        ;; )
        ;; finish
      )
      (else
        # $offset_index = $set_offset_i($id, $index)
        ;; $offset_index = offset_i($index)
        ;; (local.set $offset_index
        ;;   (call $set_offset_i
        ;;     (local.get $id)
        ;;     (local.get $index)
        ;;   )
        ;; )
        # $offset = $set_offset_i($id, $size - 1)
        ;; $offset = offset_i($size - 1)
        ;; ($i = $size - 1)
        ;; (local.set $offset
        ;;   (call $set_offset_i
        ;;     (local.get $id)
        ;;     (i32.sub
        ;;       (local.get $size)
        ;;       (i32.const 1)
        ;;     )
        ;;   )
        ;; )
        ;; loop
        (loop $loop
          # [$offset + SET_ELM_SIZE] = [$offset]
          ;; ($memory[$i+1] = $memory[$i])
          ;; (i32.store
          ;;   (i32.add
          ;;     (local.get $offset)
          ;;     (i32.const 4)
          ;;   )
          ;;   (i32.load
          ;;     (local.get $offset)
          ;;   )
          ;; )
          (if
            # $offset != $offset_index
            ;; (if $i != $index)
            ;; (i32.ne
            ;;   (local.get $offset)
            ;;   (local.get $offset_index)
            ;; )
            (then
              # $offset = $offset - SET_ELM_SIZE
              ;; ($i = $i - 1;)
              ;; (local.set $offset
              ;;   (i32.sub
              ;;     (local.get $offset)
              ;;     (i32.const 4)
              ;;   )
              ;; )
              (br $loop)
            )
            ;; (else break)
          )
          # [$offset_index] = $n
          ;; ($memory[$index] = $n)
          ;; (i32.store
          ;;   (local.get $offset_index)
          ;;   (local.get $n)
          ;; )
          # [$id] = $size + 1
          ;; $size = $size + 1
          ;; (i32.store
          ;;   (local.get $id)
          ;;   (i32.add
          ;;     (local.get $size)
          ;;     (i32.const 1)
          ;;   )
          ;; )
        )
      )
    )
  )

  (func $set_delete_i (param $id i32) (param $index i32)
    (local $size i32)
    (local $curr i32)
    (local $to i32)
    # $size = $set_size($id)
    ;; $size = size(id)
    ;; (local.set $size
    ;;   (call $set_size
    ;;     (local.get $id)
    ;;   )
    ;; )
    ;; if $size != 1
    (if
      # $size != 1
      ;; (i32.ne
      ;;   (local.get $size)
      ;;   (i32.const 1)
      ;; )
      (then
        # $curr = $set_offset_i($id, $index)
        ;; $curr = offset_i($index)
        ;; (local.set $curr
        ;;   (call $set_offset_i
        ;;     (local.get $id)
        ;;     (local.get $index)
        ;;   )
        ;; )
        # $to = $set_offset_i($id, $size - 1)
        ;; $to = offset_i($size - 1)
        ;; (local.set $to
        ;;   (call $set_offset_i
        ;;     (local.get $id)
        ;;     (i32.sub
        ;;       (local.get $size)
        ;;       (i32.const 1)
        ;;     )
        ;;   )
        ;; )
        ;; if $curr != $to
        (if
          # $curr != $to
          ;; (i32.ne
          ;;   (local.get $curr)
          ;;   (local.get $to)
          ;; )
          (then
            ;; loop
            (loop $loop
              # [$curr] = [$curr + SET_ELM_SIZE]
              ;; ($memory[$curr] = $memory[$curr + i32.size])
              ;; (i32.store
              ;;   (local.get $curr)
              ;;   (i32.load
              ;;     (i32.add
              ;;       (local.get $curr)
              ;;       (i32.const 4)
              ;;     )
              ;;   )
              ;; )
              ;; (if $curr + 1 != $to)
              (if
                # $curr + SET_ELM_SIZE != $to
                ;; (i32.ne
                ;;   (i32.add
                ;;     (local.get $curr)
                ;;     (i32.const 4)
                ;;   )
                ;;   (local.get $to)
                ;; )
                (then
                  # $curr = $curr + SET_ELM_SIZE
                  ;; ($curr = $curr + i32.size;)
                  ;; (local.set $curr
                  ;;   (i32.add
                  ;;     (local.get $curr)
                  ;;     (i32.const 4)
                  ;;   )
                  ;; )
                  (br $loop)
                )
                ;; (else break)
              )
            )
          )
        )
      )
    )
    # [$id] = $size - 1
    ;; $size = $size - 1
    ;; (i32.store
    ;;   (local.get $id)
    ;;   (i32.sub
    ;;     (local.get $size)
    ;;     (i32.const 1)
    ;;   )
    ;; )
  )

  (func $set_offset_i (param $id i32) (param $index i32) (result i32)
    # $id + SET_HEAD_SIZE + ($index << 2)
    ;; (i32.add
    ;;   (i32.add
    ;;     (local.get $id)
    ;;     (i32.const 4)
    ;;   )
    ;;   (i32.shl
    ;;     (local.get $index)
    ;;     (i32.const 2)
    ;;   )
    ;; )
  )

  (func $set_get_i (param $id i32) (param $index i32) (result i32)
    # [$set_offset_i($id, $index)]
    ;; (i32.load
    ;;   (call $set_offset_i
    ;;     (local.get $id)
    ;;     (local.get $index)
    ;;   )
    ;; )
  )

  (func $set_search (param $id i32) (param $n i32) (result i32)
    (local $size i32) (local $offset i32) (local $a i32) (local $b i32)
    (local $half i32) (local $half_index i32) (local $half_n i32) (local $res i32)

    # $size = $set_size($id)
    ;; $size = size(id)
    ;; (local.set $size
    ;;   (call $set_size
    ;;     (local.get $id)
    ;;   )
    ;; )
    # $offset = 0
    ;;  $offset = 0
    ;; (local.set $offset
    ;;   (i32.const 0)
    ;; )
    ;; if $size = 0
    (if
      # !$size ;; $size == 0
      ;; (i32.eqz
      ;;   (local.get $size)
      ;; )
      (then
        # $res = 0
        ;; $res = 0
        ;; (local.set $res
        ;;   (i32.const 0)
        ;; )
      )
      (else
        ;; loop
        (loop $loop
          # $b = $size >> 1 ;; $size / 2
          ;; $b = $size / 2
          ;; (local.set $b
          ;;   (i32.shr_u
          ;;     (local.get $size)
          ;;     (i32.const 1)
          ;;   )
          ;; )
          # $a = $size - $b
          ;; $a = $size - $b
          ;; (local.set $a
          ;;   (i32.sub
          ;;     (local.get $size)
          ;;     (local.get $b)
          ;;   )
          ;; )
          ;; left:$a:(+1-0) | right:$b
          # $half = $offset + $a
          ;; $half = $offset + $a
          ;; (local.set $half
          ;;   (i32.add
          ;;     (local.get $offset)
          ;;     (local.get $a)
          ;;   )
          ;; )
          # $half_index = $half - 1
          ;; $half_index = $half - 1
          ;; (local.set $half_index
          ;;   (i32.sub
          ;;     (local.get $half)
          ;;     (i32.const 1)
          ;;   )
          ;; )
          # $half_n = $set_get_i($id, $half_index)
          ;; $half_n = get_i($half_index)
          ;; (local.set $half_n
          ;;   (call $set_get_i
          ;;     (local.get $id)
          ;;     (local.get $half_index)
          ;;   )
          ;; )
          ;; if $n > get_i($half_index)
          (if
            # $n > $half_n
            ;; (i32.gt_u
            ;;   (local.get $n)
            ;;   (local.get $half_n)
            ;; )
            (then
              ;; if $b == 0
              (if
                # !$b ;; $b == 0
                ;; (i32.eqz
                ;;   (local.get $b)
                ;; )
                (then
                  # $res = $half
                  ;; $res = $half
                  ;; (local.set $res
                  ;;   (local.get $half)
                  ;; )

                  ;; break
                )
                (else
                  # $offset = $offset + $a
                  ;; $offset = $offset + $a
                  ;; (local.set $offset
                  ;;   (i32.add
                  ;;     (local.get $offset)
                  ;;     (local.get $a)
                  ;;   )
                  ;; )
                  # $size = $b
                  ;; $size = $b
                  ;; (local.set $size
                  ;;   (local.get $b)
                  ;; )

                  ;; continue
                  (br $loop)
                )
              )
            )
            (else
              ;; if $n != $half_n
              (if
                # $n != $half_n
                ;; (i32.ne
                ;;   (local.get $n)
                ;;   (local.get $half_n)
                ;; )
                (then
                  ;; if $size == 1
                  (if
                    # $size == 1
                    ;; (i32.eq
                    ;;   (local.get $size)
                    ;;   (i32.const 1)
                    ;; )
                    (then
                      # $res = $half_index
                      ;; $res = $half_index
                      ;; (local.set $res
                      ;;   (local.get $half_index)
                      ;; )

                      ;; break
                    )
                    (else
                      # $size = $a
                      ;; $size = $a
                      ;; (local.set $size
                      ;;   (local.get $a)
                      ;; )

                      ;; continue
                      (br $loop)
                    )
                  )
                )
                ;; $n == $half_n
                (else
                  # $res = $half_index
                  ;; $res = $half_index
                  ;; (local.set $res
                  ;;   (local.get $half_index)
                  ;; )

                  ;; break
                )
              )
            )
          )
        )
      )
    )
    # $res
    ;; (local.get $res)
  )

  (func $set_has (param $id i32) (param $n i32) (result i32)
    (local $size i32)
    (local $i i32)
    (local $i_n i32)
    (local $res i32)
    # $size = $set_size($id)
    ;; $size = size()
    ;; (local.set $size
    ;;   (call $set_size
    ;;     (local.get $id)
    ;;   )
    ;; )
    ;; if !$size
    (if
      # !$size ;; $size == 0
      ;; (i32.eqz
      ;;   (local.get $size)
      ;; )
      (then
        # $res = 0
        ;; $res = 0
        ;; (local.set $res
        ;;   (i32.const 0)
        ;; )
      )
      (else
        # $i = $set_search($id, $n)
        ;; $i = search($n)
        ;; (local.set $i
        ;;   (call $set_search
        ;;     (local.get $id)
        ;;     (local.get $n)
        ;;   )
        ;; )
        ;; if i == size
        (if
          # $i == $size
          ;; (i32.eq
          ;;   (local.get $i)
          ;;   (local.get $size)
          ;; )
          (then
            # $res = 0
            ;; $res = 0
            ;; (local.set $res
            ;;   (i32.const 0)
            ;; )
          )
          (else
            # $i_n = $set_get_i($id, $i)
            ;; $i_n = get_i($i)
            ;; (local.set $i_n
            ;;   (call $set_get_i
            ;;     (local.get $id)
            ;;     (local.get $i)
            ;;   )
            ;; )

            ;; if $n == $i_n
            (if
              # $n == $i_n
              ;; (i32.eq
              ;;   (local.get $n)
              ;;   (local.get $i_n)
              ;; )
              (then
                # $res = 1
                ;; $res = 1
                ;; (local.set $res
                ;;   (i32.const 1)
                ;; )
              )
              (else
                # $res = 0
                ;; $res = 0
                ;; (local.set $res
                ;;   (i32.const 0)
                ;; )
              )
            )
          )
        )
      )
    )
    # $res
    ;; (local.get $res)
  )

  (func $set_delete (param $id i32) (param $n i32) (result i32)
    (local $size i32)
    (local $i i32)
    (local $i_n i32)
    (local $res i32)
    # $size = $set_size($id)
    ;; $size = size()
    ;; (local.set $size
    ;;   (call $set_size
    ;;     (local.get $id)
    ;;   )
    ;; )
    ;; if !$size
    (if
      # !$size ;; $size == 0
      ;; (i32.eqz
      ;;   (local.get $size)
      ;; )
      (then
        # $res = 0
        ;; $res = 0
        ;; (local.set $res
        ;;   (i32.const 0)
        ;; )
      )
      (else
        # $i = $set_search($id, $n)
        ;; $i = search($n)
        ;; (local.set $i
        ;;   (call $set_search
        ;;     (local.get $id)
        ;;     (local.get $n)
        ;;   )
        ;; )
        ;; if i == size
        (if
          # $i == $size
          ;; (i32.eq
          ;;   (local.get $i)
          ;;   (local.get $size)
          ;; )
          (then
            # $res = 0
            ;; $res = 0
            ;; (local.set $res
            ;;   (i32.const 0)
            ;; )
          )
          (else
            # $i_n = $set_get_i($id, $i)
            ;; $i_n = get_i($i)
            ;; (local.set $i_n
            ;;   (call $set_get_i
            ;;     (local.get $id)
            ;;     (local.get $i)
            ;;   )
            ;; )

            ;; if $n != $i_n
            (if
              # $n != $i_n
              ;; (i32.ne
              ;;   (local.get $n)
              ;;   (local.get $i_n)
              ;; )
              (then
                # $res = 0
                ;; $res = 0
                ;; (local.set $res
                ;;   (i32.const 0)
                ;; )
              )
              (else
                # $set_delete_i($id, $i)
                ;; delete_i(i)
                ;; (call $set_delete_i
                ;;   (local.get $id)
                ;;   (local.get $i)
                ;; )
                # $res = 1
                ;; $res = 1
                ;; (local.set $res
                ;;   (i32.const 1)
                ;; )
              )
            )
          )
        )
      )
    )
    # $res
    ;; (local.get $res)
  )

  (func $set_free (param $id i32) (result i32)
    # 0
    ;; (i32.const 0)
  )

  (export "set_create" (func $set_create))
  (export "set_add" (func $set_add))
  (export "set_has" (func $set_has))
  (export "set_delete" (func $set_delete))
  (export "set_size" (func $set_size))
  (export "set_free" (func $set_free))
  (export "seq_id_init" (func $seq_id_init))
)
