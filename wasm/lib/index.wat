(module
  ;; (import "env" "log_i32" (func $log_i32_1 (param i32)))
  ;; (import "env" "log_i32" (func $log_i32_2 (param i32 i32)))
  ;; (import "env" "log_i32" (func $log_i32_3 (param i32 i32 i32)))
  ;; (import "env" "log_i32" (func $log_i32_4 (param i32 i32 i32 i32)))
  (import "env" "memory" (memory 1))

  ;; Set memory struct (i32 numbers)
  ;; 0 - size
  ;; [1..size) - ordered set of unsigned i32

  (func $seq_id_init
    ;; TODO: Replace to data section with initial values
    (i32.store
      (i32.const 4) ;; Seq Id address
      (i32.const 0)
    )
  )

  (func $seq_id_next (result i32)
    (local $id i32)
    (local.set $id
      (i32.add
        (i32.load
          (i32.const 4)
        )
        (i32.const 1)
      )
    )
    (i32.store
      (i32.const 4)
      (local.get $id)
    )
    (local.get $id)
  )

  (func $set_create (result i32)
    (local $id i32)
    (local.set $id
      (i32.shl
        (call $seq_id_next)
        ;; Each set 128 bytes by default
        (i32.const 7)
      )
    )
    (i32.store (local.get $id) (i32.const 0))
    (local.get $id)
  )

  (func $set_add (param $id i32) (param $n i32)
    (local $size i32)
    (local $i i32)
    (local $i_n i32)
    ;; $size = size(id)
    (local.set $size
      (call $set_size
        (local.get $id)
      )
    )
    ;; $i = search($id, $n)
    (local.set $i
      (call $set_search
        (local.get $id)
        (local.get $n)
      )
    )
    ;; if $i == $size
    (if
      (i32.eq
        (local.get $i)
        (local.get $size)
      )
      (then
        ;; insert($i, $n)
        (call $set_insert_i
          (local.get $id)
          (local.get $i)
          (local.get $n)
        )
      )
      (else
        ;; $i_n = get_i($i)
        (local.set $i_n
          (call $set_get_i
            (local.get $id)
            (local.get $i)
          )
        )
        ;; if $n != $i_n
        (if
          (i32.ne
            (local.get $n)
            (local.get $i_n)
          )
          (then
            ;; insert($i, $n)
            (call $set_insert_i
              (local.get $id)
              (local.get $i)
              (local.get $n)
            )
          )
        )
      )
    )
  )

  (func $set_size (param $id i32) (result i32)
    (i32.load
      (local.get $id)
    )
  )

  (func $set_insert_i (param $id i32) (param $index i32) (param $n i32)
    (local $size i32)
    (local $offset i32)
    (local $offset_index i32)

    ;; $size = size(id)
    (local.set $size
      (call $set_size
        (local.get $id)
      )
    )
    ;; if $index == $size
    (if
      (i32.eq
        (local.get $index)
        (local.get $size)
      )
      (then
        ;; $mem[$index] = $n
        (i32.store
          (call $set_offset_i
            (local.get $id)
            (local.get $index)
          )
          (local.get $n)
        )
        ;; $size = $size + 1
        (i32.store
          (local.get $id)
          (i32.add
            (local.get $size)
            (i32.const 1)
          )
        )
        ;; finish
      )
      (else
        ;; $offset_index = offset_i($index)
        (local.set $offset_index
          (call $set_offset_i
            (local.get $id)
            (local.get $index)
          )
        )
        ;; $offset = offset_i($size - 1)
        ;; ($i = $size - 1)
        (local.set $offset
          (call $set_offset_i
            (local.get $id)
            (i32.sub
              (local.get $size)
              (i32.const 1)
            )
          )
        )
        ;; loop
        (loop $loop
          ;; ($memory[$i+1] = $memory[$i])
          (i32.store
            (i32.add
              (local.get $offset)
              (i32.const 4)
            )
            (i32.load
              (local.get $offset)
            )
          )
          (if
            ;; (if $i != $index)
            (i32.ne
              (local.get $offset)
              (local.get $offset_index)
            )
            (then
              ;; ($i = $i - 1;)
              (local.set $offset
                (i32.sub
                  (local.get $offset)
                  (i32.const 4)
                )
              )
              (br $loop)
            )
            ;; (else break)
          )
          ;; ($memory[$index] = $n)
          (i32.store
            (local.get $offset_index)
            (local.get $n)
          )
          ;; $size = $size + 1
          (i32.store
            (local.get $id)
            (i32.add
              (local.get $size)
              (i32.const 1)
            )
          )
        )
      )
    )
  )

  (func $set_delete_i (param $id i32) (param $index i32)
    (local $size i32)
    (local $curr i32)
    (local $to i32)
    ;; $size = size(id)
    (local.set $size
      (call $set_size
        (local.get $id)
      )
    )
    ;; if $size != 1
    (if
      (i32.ne
        (local.get $size)
        (i32.const 1)
      )
      (then
        ;; $curr = offset_i($index)
        (local.set $curr
          (call $set_offset_i
            (local.get $id)
            (local.get $index)
          )
        )
        ;; $to = offset_i($size - 1)
        (local.set $to
          (call $set_offset_i
            (local.get $id)
            (i32.sub
              (local.get $size)
              (i32.const 1)
            )
          )
        )
        ;; if $curr != $to
        (if
          (i32.ne
            (local.get $curr)
            (local.get $to)
          )
          (then
            ;; loop
            (loop $loop
              ;; ($memory[$curr] = $memory[$curr + i32.size])
              (i32.store
                (local.get $curr)
                (i32.load
                  (i32.add
                    (local.get $curr)
                    (i32.const 4)
                  )
                )
              )
              ;; (if $curr + 1 != $to)
              (if
                (i32.ne
                  (i32.add
                    (local.get $curr)
                    (i32.const 4)
                  )
                  (local.get $to)
                )
                (then
                  ;; ($curr = $curr + i32.size;)
                  (local.set $curr
                    (i32.add
                      (local.get $curr)
                      (i32.const 4)
                    )
                  )
                  (br $loop)
                )
                ;; (else break)
              )
            )
          )
        )
      )
    )
    ;; $size = $size - 1
    (i32.store
      (local.get $id)
      (i32.sub
        (local.get $size)
        (i32.const 1)
      )
    )
  )

  (func $set_offset_i (param $id i32) (param $index i32) (result i32)
    (i32.add
      (i32.add
        (local.get $id)
        (i32.const 4)
      )
      (i32.shl
        (local.get $index)
        (i32.const 2)
      )
    )
  )

  (func $set_get_i (param $id i32) (param $index i32) (result i32)
    (i32.load
      (call $set_offset_i
        (local.get $id)
        (local.get $index)
      )
    )
  )

  (func $set_search (param $id i32) (param $n i32) (result i32)
    (local $size i32)
    (local $offset i32)
    (local $a i32)
    (local $b i32)
    (local $half i32)
    (local $half_index i32)
    (local $half_n i32)
    (local $res i32)
    ;; $size = size(id)
    (local.set $size
      (call $set_size
        (local.get $id)
      )
    )
    ;;  $offset = 0
    (local.set $offset
      (i32.const 0)
    )
    ;; if $size = 0
    (if
      (i32.eqz
        (local.get $size)
      )
      (then
        ;; $res = 0
        (local.set $res
          (i32.const 0)
        )
      )
      (else
        ;; loop
        (loop $loop
          ;; $b = $size / 2
          (local.set $b
            (i32.shr_u
              (local.get $size)
              (i32.const 1)
            )
          )
          ;; $a = $size - $b
          (local.set $a
            (i32.sub
              (local.get $size)
              (local.get $b)
            )
          )
          ;; left:$a:(+1-0) | right:$b
          ;; $half = $offset + $a
          (local.set $half
            (i32.add
              (local.get $offset)
              (local.get $a)
            )
          )
          ;; $half_index = $half - 1
          (local.set $half_index
            (i32.sub
              (local.get $half)
              (i32.const 1)
            )
          )
          ;; $half_n = get_i($half_index)
          (local.set $half_n
            (call $set_get_i
              (local.get $id)
              (local.get $half_index)
            )
          )
          ;; if $n > get_i($half_index)
          (if
            (i32.gt_u
              (local.get $n)
              (local.get $half_n)
            )
            (then
              ;; if $b == 0
              (if
                (i32.eqz
                  (local.get $b)
                )
                (then
                  ;; $res = $half
                  (local.set $res
                    (local.get $half)
                  )
                  ;; break
                )
                (else
                  ;; $offset = $offset + $a
                  (local.set $offset
                    (i32.add
                      (local.get $offset)
                      (local.get $a)
                    )
                  )
                  ;; $size = $b
                  (local.set $size
                    (local.get $b)
                  )
                  ;; continue
                  (br $loop)
                )
              )
            )
            (else
              ;; if $n != $half_n
              (if
                (i32.ne
                  (local.get $n)
                  (local.get $half_n)
                )
                (then
                  ;; if $size == 1
                  (if
                    (i32.eq
                      (local.get $size)
                      (i32.const 1)
                    )
                    (then
                      ;; $res = $half_index
                      (local.set $res
                        (local.get $half_index)
                      )
                      ;; break
                    )
                    (else
                      ;; $size = $a
                      (local.set $size
                        (local.get $a)
                      )
                      ;; continue
                      (br $loop)
                    )
                  )
                )
                ;; $n == $half_n
                (else
                  ;; $res = $half_index
                  (local.set $res
                    (local.get $half_index)
                  )
                  ;; break
                )
              )
            )
          )
        )
      )
    )
    (local.get $res)
  )

  (func $set_has (param $id i32) (param $n i32) (result i32)
    (local $size i32)
    (local $i i32)
    (local $i_n i32)
    (local $res i32)
    ;; $size = size()
    (local.set $size
      (call $set_size
        (local.get $id)
      )
    )
    ;; if !$size
    (if
      (i32.eqz
        (local.get $size)
      )
      (then
        ;; $res = 0
        (local.set $res
          (i32.const 0)
        )
      )
      (else
        ;; $i = search($n)
        (local.set $i
          (call $set_search
            (local.get $id)
            (local.get $n)
          )
        )
        ;; if i == size
        (if
          (i32.eq
            (local.get $i)
            (local.get $size)
          )
          (then
            ;; $res = 0
            (local.set $res
              (i32.const 0)
            )
          )
          (else
            ;; $i_n = get_i($i)
            (local.set $i_n
              (call $set_get_i
                (local.get $id)
                (local.get $i)
              )
            )

            ;; if $n == $i_n
            (if
              (i32.eq
                (local.get $n)
                (local.get $i_n)
              )
              (then
                ;; $res = 1
                (local.set $res
                  (i32.const 1)
                )
              )
              (else
                ;; $res = 0
                (local.set $res
                  (i32.const 0)
                )
              )
            )
          )
        )
      )
    )
    (local.get $res)
  )

  (func $set_delete (param $id i32) (param $n i32) (result i32)
    (local $size i32)
    (local $i i32)
    (local $i_n i32)
    (local $res i32)
    ;; $size = size()
    (local.set $size
      (call $set_size
        (local.get $id)
      )
    )
    ;; if !$size
    (if
      (i32.eqz
        (local.get $size)
      )
      (then
        ;; $res = 0
        (local.set $res
          (i32.const 0)
        )
      )
      (else
        ;; $i = search($n)
        (local.set $i
          (call $set_search
            (local.get $id)
            (local.get $n)
          )
        )
        ;; if i == size
        (if
          (i32.eq
            (local.get $i)
            (local.get $size)
          )
          (then
            ;; $res = 0
            (local.set $res
              (i32.const 0)
            )
          )
          (else
            ;; $i_n = get_i($i)
            (local.set $i_n
              (call $set_get_i
                (local.get $id)
                (local.get $i)
              )
            )

            ;; if $n != $i_n
            (if
              (i32.ne
                (local.get $n)
                (local.get $i_n)
              )
              (then
                ;; $res = 0
                (local.set $res
                  (i32.const 0)
                )
              )
              (else
                ;; delete_i(i)
                (call $set_delete_i
                  (local.get $id)
                  (local.get $i)
                )
                ;; $res = 1
                (local.set $res
                  (i32.const 1)
                )
              )
            )
          )
        )
      )
    )
    (local.get $res)
  )

  (func $set_free (param $id i32) (result i32)
    (i32.const 0)
  )

  (export "set_create" (func $set_create))
  (export "set_add" (func $set_add))
  (export "set_has" (func $set_has))
  (export "set_delete" (func $set_delete))
  (export "set_size" (func $set_size))
  (export "set_free" (func $set_free))
  (export "seq_id_init" (func $seq_id_init))
)
