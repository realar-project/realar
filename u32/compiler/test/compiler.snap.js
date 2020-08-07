// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`should work 1`] = `
"(;;## import code/index;;)
(module
  (;;## import imports;;)
(;;## <debug>;;)


(import \\"env\\" \\"error\\" (func $error (param i32)))
(import \\"env\\" \\"call\\" (func $call (param i32)))

  (memory $0 1)

  (;;## import errors;;)
(;;## define TICK_DEEP_LIMIT_EXCEPTION 1;;)
(;;## define DIGEST_LOOP_LIMIT_EXCEPTION 2;;)
  (;;## import head;;)

(;;global slice_current;;)
(global $slice_current (mut i32) (i32.const 0))
(global $mem_tail (mut i32) (i32.const 0))
(global $mem_map (mut i32) (i32.const 0))
(global $seq_current (mut i32) (i32.const 0))
(global $tick_deep (mut i32) (i32.const 0))
(global $tick_changed (mut i32) (i32.const 0))
(global $box_deps (mut i32) (i32.const 0))
(global $box_rels (mut i32) (i32.const 0))
(global $box_invalid (mut i32) (i32.const 0))
(global $box_expr (mut i32) (i32.const 0))


(;;export push pop;;)
(export \\"push\\" (func $push)) (export \\"pop\\" (func $pop))


(;;func start;;)
(func $start   
(call $mem_tail_init)
  
(call $slice_init)
  
(call $each_slice_init)

)

(;;func each_slice_init;;)
(func $each_slice_init   
(call $seq_init)
  
(call $mem_init)
  
(call $box_init)

)

(;;func slice_init;;)
(func $slice_init   
(global.set $slice_current (i32.const 0))

)

(;;func push;;)
(func $push (local $slice i32)   ;; slice equals prev mem_tail
(local.set $slice (call $mem_tail_n_inc (i32.const 16)))

   ;; 0 index - prev slice_current
(i32.store (i32.shl (local.get $slice) (i32.const 2)) (global.get $slice_current))
   ;; 1 index - prev seq_current
(i32.store (i32.shl (i32.add (local.get $slice) (i32.const 1)) (i32.const 2)) (global.get $seq_current))
   ;; 2 index - prev mem_map
(i32.store (i32.shl (i32.add (local.get $slice) (i32.const 2)) (i32.const 2)) (global.get $mem_map))

  
(i32.store (i32.shl (i32.add (local.get $slice) (i32.const 3)) (i32.const 2)) (global.get $tick_deep))
  
(i32.store (i32.shl (i32.add (local.get $slice) (i32.const 4)) (i32.const 2)) (global.get $tick_changed))
  
(i32.store (i32.shl (i32.add (local.get $slice) (i32.const 5)) (i32.const 2)) (global.get $box_deps))
  
(i32.store (i32.shl (i32.add (local.get $slice) (i32.const 6)) (i32.const 2)) (global.get $box_rels))
  
(i32.store (i32.shl (i32.add (local.get $slice) (i32.const 7)) (i32.const 2)) (global.get $box_invalid))
  
(i32.store (i32.shl (i32.add (local.get $slice) (i32.const 8)) (i32.const 2)) (global.get $box_expr))

   ;; switch to new slice
(global.set $slice_current (local.get $slice))
  
(call $each_slice_init)

)

(;;func pop;;)
(func $pop (local $slice i32)  
(local.set $slice (global.get $slice_current))
  
(global.set $mem_tail (local.get $slice))

  
(global.set $slice_current (i32.load (i32.shl (local.get $slice) (i32.const 2))))
  
(global.set $seq_current (i32.load (i32.shl (i32.add (local.get $slice) (i32.const 1)) (i32.const 2))))
  
(global.set $mem_map (i32.load (i32.shl (i32.add (local.get $slice) (i32.const 2)) (i32.const 2))))

  
(global.set $tick_deep (i32.load (i32.shl (i32.add (local.get $slice) (i32.const 3)) (i32.const 2))))
  
(global.set $tick_changed (i32.load (i32.shl (i32.add (local.get $slice) (i32.const 4)) (i32.const 2))))
  
(global.set $box_deps (i32.load (i32.shl (i32.add (local.get $slice) (i32.const 5)) (i32.const 2))))
  
(global.set $box_rels (i32.load (i32.shl (i32.add (local.get $slice) (i32.const 6)) (i32.const 2))))
  
(global.set $box_invalid (i32.load (i32.shl (i32.add (local.get $slice) (i32.const 7)) (i32.const 2))))
  
(global.set $box_expr (i32.load (i32.shl (i32.add (local.get $slice) (i32.const 8)) (i32.const 2))))

)


  (;;## import mem/mem_tail;;)

(;;global mem_tail;;)



(;;func mem_tail_init;;)
(func $mem_tail_init   
(global.set $mem_tail (i32.const 1))

)

(;;func mem_tail_inc(size);;)
(func $mem_tail_inc (param $size i32)  
(global.set $mem_tail (i32.add (global.get $mem_tail) (local.get $size)))

)

(;;func mem_tail_n_inc(size) result;;)
(func $mem_tail_n_inc (param $size i32) (result i32)(local $ptr i32)  
(local.set $ptr (global.get $mem_tail))
  
(call $mem_tail_inc (local.get $size))
  
(local.get $ptr)

)
(;;## <debug>;;)


(;;## <debug>;;)


  (;;## import mem/mem_copy;;)

;; Until \\"bulk memory\\" will experimental (memory.copy)

(;;func mem_copy(dst src size);;)
(func $mem_copy (param $dst i32) (param $src i32) (param $size i32)(local $i i32)  
(if (i32.lt_u (local.get $dst) (local.get $src))
    (then 
(local.set $i (i32.const 0))
    
(loop $loop
      
(if (i32.lt_u (local.get $i) (local.get $size))
        (then 
(i32.store (i32.shl (i32.add (local.get $dst) (local.get $i)) (i32.const 2)) (i32.load (i32.shl (i32.add (local.get $src) (local.get $i)) (i32.const 2))))
        
(local.set $i (i32.add (local.get $i) (i32.const 1)))
        
(br $loop)
  )
)))(else 
    
(local.set $i (local.get $size))
    
(loop $loop
      
(if (i32.gt_u (local.get $i) (i32.const 0))
        (then 
(local.set $i (i32.sub (local.get $i) (i32.const 1)))
        
(i32.store (i32.shl (i32.add (local.get $dst) (local.get $i)) (i32.const 2)) (i32.load (i32.shl (i32.add (local.get $src) (local.get $i)) (i32.const 2))))
        
(br $loop)

))))))

  (;;## import mem/mem;;)

(;;global mem_map;;)



(;;func mem_alloc(size) result;;)
(func $mem_alloc (param $size i32) (result i32)(local $ptr i32)  
(local.set $ptr (call $mem_alloc_block (i32.const 2)))
   ;; 0 index - memory block
(i32.store (i32.shl (local.get $ptr) (i32.const 2)) (call $mem_alloc_block (local.get $size)))
   ;; 1 index - size of memory block
(i32.store (i32.shl (call $mem_size_ptr (local.get $ptr)) (i32.const 2)) (local.get $size))
  
(local.get $ptr)

)

(;;func mem_size_ptr(ptr) result;;)
(func $mem_size_ptr (param $ptr i32) (result i32)  
(i32.add (local.get $ptr) (i32.const 1))

)

(;;func mem_size(ptr) result;;)
(func $mem_size (param $ptr i32) (result i32)   ;; size
(i32.load (i32.shl (call $mem_size_ptr (local.get $ptr)) (i32.const 2)))

)

(;;func mem_free(ptr);;)
(func $mem_free (param $ptr i32)   ;; We have two piece of memory 2 and size
(call $mem_free_block (i32.load (i32.shl (local.get $ptr) (i32.const 2))) (call $mem_size (local.get $ptr)))
  
(call $mem_free_block (local.get $ptr) (i32.const 2))


)

(;;func mem_free_block(ptr size);;)
(func $mem_free_block (param $ptr i32) (param $size i32)  
(if (i32.eqz (call $map_has (global.get $mem_map) (local.get $size)))
    (then  ;; Array of pointers on each block
(call $map_set (global.get $mem_map) (local.get $size) (call $arr_create))

  ))
(call $arr_push (call $map_get (global.get $mem_map) (local.get $size)) (local.get $ptr))


)

(;;func mem_alloc_block(size) result;;)
(func $mem_alloc_block (param $size i32) (result i32)(local $ptr i32)  
(if (call $mem_has_free_place (local.get $size))
    (then 
(local.set $ptr (call $mem_alloc_free_place (local.get $size)))
  )
(else 
    
(local.set $ptr (call $mem_tail_n_inc (local.get $size)))
  ))
(local.get $ptr)


)

(;;func mem_x4(ptr);;)
(func $mem_x4 (param $ptr i32)(local $s i32)(local $s4 i32)(local $m4 i32)(local $m1 i32)  
(local.set $s (call $mem_size (local.get $ptr)))
  
(local.set $s4 (i32.shl (local.get $s) (i32.const 2)))
  
(local.set $m4 (call $mem_alloc_block (local.get $s4)))
  
(local.set $m1 (i32.load (i32.shl (local.get $ptr) (i32.const 2))))
  
(call $mem_copy (local.get $m4) (local.get $m1) (local.get $s))
  
(call $mem_free_block (local.get $m1) (local.get $s))
  
(i32.store (i32.shl (local.get $ptr) (i32.const 2)) (local.get $m4))
  
(i32.store (i32.shl (call $mem_size_ptr (local.get $ptr)) (i32.const 2)) (local.get $s4))


)

(;;func mem_non_copy_resize(ptr new_size);;)
(func $mem_non_copy_resize (param $ptr i32) (param $new_size i32)(local $prev_size i32)(local $new_mem_block i32)(local $prev_mem_block i32)  
(local.set $prev_size (call $mem_size (local.get $ptr)))
  
(local.set $new_mem_block (call $mem_alloc_block (local.get $new_size)))
  
(local.set $prev_mem_block (i32.load (i32.shl (local.get $ptr) (i32.const 2))))
  
(call $mem_free_block (local.get $prev_mem_block) (local.get $prev_size))
  
(i32.store (i32.shl (local.get $ptr) (i32.const 2)) (local.get $new_mem_block))
  
(i32.store (i32.shl (call $mem_size_ptr (local.get $ptr)) (i32.const 2)) (local.get $new_size))

)

(;;func mem_has_free_place(size) result;;)
(func $mem_has_free_place (param $size i32) (result i32)(local $res i32)   ;; beginning phase
(if (i32.eqz (global.get $mem_map))
    (then 
(local.set $res (i32.const 0))
  )
(else 
    
(if (i32.eqz (call $map_has (global.get $mem_map) (local.get $size)))
      (then 
(local.set $res (i32.const 0))
    )
(else 
      
(local.set $res (call $arr_len (call $map_get (global.get $mem_map) (local.get $size))))
  ))))
(local.get $res)

)

(;;func mem_alloc_free_place(size) result;;)
(func $mem_alloc_free_place (param $size i32) (result i32)(local $ptrs i32)  
(local.set $ptrs (call $map_get (global.get $mem_map) (local.get $size)))
  
(call $arr_pop (local.get $ptrs))

)

(;;func mem_init;;)
(func $mem_init   ;; Map of free memory blocks. size => [ptr, ...]
   ;; init null
(global.set $mem_map (i32.const 0))
  
(global.set $mem_map (call $map_create))

)
(;;## <debug>;;)


(;;## <debug>;;)



  (;;## import adt/set;;)

;; memory struct
;; 0 - size
;; [1..size) - values


(;;func set_create result;;)
(func $set_create  (result i32)(local $id i32)   ;; Set default memory size block 32 -> 31 elements
(local.set $id (call $mem_alloc (i32.const 32)))
  
(call $set_clear (local.get $id))
  
(local.get $id)

)

(;;func set_size_ptr(id) result;;)
(func $set_size_ptr (param $id i32) (result i32)  
(i32.load (i32.shl (local.get $id) (i32.const 2)))

)

(;;func set_data_ptr(id) result;;)
(func $set_data_ptr (param $id i32) (result i32)  
(i32.add (i32.load (i32.shl (local.get $id) (i32.const 2))) (i32.const 1))

)

(;;func set_size(id) result;;)
(func $set_size (param $id i32) (result i32)  
(i32.load (i32.shl (call $set_size_ptr (local.get $id)) (i32.const 2)))

)

(;;func set_clear(id);;)
(func $set_clear (param $id i32)   ;; size
(i32.store (i32.shl (call $set_size_ptr (local.get $id)) (i32.const 2)) (i32.const 0))

)

(;;func set_size_inc(id);;)
(func $set_size_inc (param $id i32)(local $size_ptr i32)(local $size i32)  
(local.set $size_ptr (call $set_size_ptr (local.get $id)))
  
(local.set $size (i32.load (i32.shl (local.get $size_ptr) (i32.const 2))))
   ;; substract size
(if (i32.eq (local.get $size) (i32.sub (call $mem_size (local.get $id)) (i32.const 1)))
    (then 
(call $mem_x4 (local.get $id))
    
(local.set $size_ptr (call $set_size_ptr (local.get $id)))
  ))
(i32.store (i32.shl (local.get $size_ptr) (i32.const 2)) (i32.add (local.get $size) (i32.const 1)))

)

(;;func set_size_dec(id);;)
(func $set_size_dec (param $id i32)(local $size_ptr i32)  
(local.set $size_ptr (call $set_size_ptr (local.get $id)))
  
(i32.store (i32.shl (local.get $size_ptr) (i32.const 2)) (i32.sub (i32.load (i32.shl (local.get $size_ptr) (i32.const 2))) (i32.const 1)))


)

(;;func set_assign(dst src);;)
(func $set_assign (param $dst i32) (param $src i32)(local $src_size i32)(local $mem_size_dst i32)(local $k i32)  
(local.set $src_size (call $set_size (local.get $src)))

  
(local.set $mem_size_dst (call $mem_size (local.get $dst)))
  
(if (i32.lt_u (i32.sub (local.get $mem_size_dst) (i32.const 1)) (local.get $src_size))
    (then 
(local.set $k (local.get $mem_size_dst))
    
(loop $loop
       ;; x4 grow by default
(local.set $k (i32.shl (local.get $k) (i32.const 2)))
      
(if (i32.lt_u (i32.sub (local.get $k) (i32.const 1)) (local.get $src_size))
        (then 
(br $loop)
    )))
(call $mem_non_copy_resize (local.get $dst) (local.get $k))

  ))
(call $mem_copy (i32.load (i32.shl (local.get $dst) (i32.const 2))) (i32.load (i32.shl (local.get $src) (i32.const 2))) (i32.add (local.get $src_size) (i32.const 1)))


)

(;;func set_add(id n);;)
(func $set_add (param $id i32) (param $n i32)(local $size i32)(local $i i32)(local $i_n i32)  
(local.set $size (call $set_size (local.get $id)))
  
(local.set $i (call $set_search (local.get $id) (local.get $n)))
  
(if (i32.eq (local.get $i) (local.get $size))
    (then 
(call $set_insert_i (local.get $id) (local.get $i) (local.get $n))
  )
(else 
    
(local.set $i_n (call $set_get_i (local.get $id) (local.get $i)))
    
(if (i32.ne (local.get $n) (local.get $i_n))
      (then 
(call $set_insert_i (local.get $id) (local.get $i) (local.get $n))

)))))

(;;func set_insert_i(id index n);;)
(func $set_insert_i (param $id i32) (param $index i32) (param $n i32)(local $size i32)(local $offset i32)  
(local.set $size (call $set_size (local.get $id)))
  
(call $set_size_inc (local.get $id))
  
(local.set $offset (i32.add (call $set_data_ptr (local.get $id)) (local.get $index)))
  
(if (i32.ne (local.get $index) (local.get $size))
    (then 
(call $mem_copy (i32.add (local.get $offset) (i32.const 1)) (local.get $offset) (i32.sub (local.get $size) (local.get $index)))
  ))
(i32.store (i32.shl (local.get $offset) (i32.const 2)) (local.get $n))


)

(;;func set_delete_i(id index);;)
(func $set_delete_i (param $id i32) (param $index i32)(local $size i32)(local $offset i32)  
(local.set $size (call $set_size (local.get $id)))
  
(if (i32.ne (local.get $size) (i32.const 1))
    (then 
(local.set $offset (i32.add (call $set_data_ptr (local.get $id)) (local.get $index)))
    
(call $mem_copy (local.get $offset) (i32.add (local.get $offset) (i32.const 1)) (i32.sub (local.get $size) (i32.sub (local.get $index) (i32.const 1))))
  ))
(call $set_size_dec (local.get $id))


)

(;;func set_get_i(id index) result;;)
(func $set_get_i (param $id i32) (param $index i32) (result i32)  
(i32.load (i32.shl (i32.add (call $set_data_ptr (local.get $id)) (local.get $index)) (i32.const 2)))


)

(;;func set_search(id n) result;;)
(func $set_search (param $id i32) (param $n i32) (result i32)(local $size i32)(local $offset i32)(local $res i32)(local $b i32)(local $a i32)(local $half i32)(local $half_index i32)(local $half_n i32)  
(local.set $size (call $set_size (local.get $id)))
  
(local.set $offset (i32.const 0))
  
(if (i32.eqz (local.get $size))
    (then 
(local.set $res (i32.const 0))
  )
(else 
    
(loop $loop
       ;; size / 2
(local.set $b (i32.shr_u (local.get $size) (i32.const 1)))
      
(local.set $a (i32.sub (local.get $size) (local.get $b)))

      ;; left:a:(+1-0) | right:b
      
(local.set $half (i32.add (local.get $offset) (local.get $a)))
      
(local.set $half_index (i32.sub (local.get $half) (i32.const 1)))

      
(local.set $half_n (call $set_get_i (local.get $id) (local.get $half_index)))

      
(if (i32.gt_u (local.get $n) (local.get $half_n))
        (then 
(if (i32.eqz (local.get $b))
          (then 
(local.set $res (local.get $half))
        )
(else 
          
(local.set $offset (i32.add (local.get $offset) (local.get $a)))
          
(local.set $size (local.get $b))
          
(br $loop)
      )
))(else 
        
(if (i32.ne (local.get $n) (local.get $half_n))
          (then 
(if (i32.eq (local.get $size) (i32.const 1))
            (then 
(local.set $res (local.get $half_index))
          )
(else 
            
(local.set $size (local.get $a))
            
(br $loop)
        )
))(else 
          
(local.set $res (local.get $half_index))
  )))))))
(local.get $res)


)

(;;func set_has(id n) result;;)
(func $set_has (param $id i32) (param $n i32) (result i32)(local $size i32)(local $res i32)(local $i i32)(local $i_n i32)  
(local.set $size (call $set_size (local.get $id)))
  
(if (i32.eqz (local.get $size))
    (then 
(local.set $res (i32.const 0))
  )
(else 
    
(local.set $i (call $set_search (local.get $id) (local.get $n)))
    
(if (i32.eq (local.get $i) (local.get $size))
      (then 
(local.set $res (i32.const 0))
    )
(else 
      
(local.set $i_n (call $set_get_i (local.get $id) (local.get $i)))
      
(if (i32.eq (local.get $n) (local.get $i_n))
        (then 
(local.set $res (i32.const 1))
      )
(else  
(local.set $res (i32.const 0))
  ))))))
(local.get $res)


)

(;;func set_delete(id n) result;;)
(func $set_delete (param $id i32) (param $n i32) (result i32)(local $size i32)(local $res i32)(local $i i32)(local $i_n i32)  
(local.set $size (call $set_size (local.get $id)))
  
(if (i32.eqz (local.get $size))
    (then 
(local.set $res (i32.const 0))
  )
(else 
    
(local.set $i (call $set_search (local.get $id) (local.get $n)))
    
(if (i32.eq (local.get $i) (local.get $size))
      (then 
(local.set $res (i32.const 0))
    )
(else 
      
(local.set $i_n (call $set_get_i (local.get $id) (local.get $i)))
      
(if (i32.ne (local.get $n) (local.get $i_n))
        (then 
(local.set $res (i32.const 0))
      )
(else 
        
(call $set_delete_i (local.get $id) (local.get $i))
        
(local.set $res (i32.const 1))
  ))))))
(local.get $res)

)

(;;func set_free(id);;)
(func $set_free (param $id i32)  
(call $mem_free (local.get $id))

)

  (;;## import adt/arr;;)

;; memory struct
;; 0 index - length (push, pop)


(;;func arr_create result;;)
(func $arr_create  (result i32)(local $id i32)   ;; Array default memory size block 32 -> 31 elements
(local.set $id (call $mem_alloc (i32.const 32)))
  
(call $arr_clear (local.get $id))
  
(local.get $id)

)

(;;func arr_len_ptr(id) result;;)
(func $arr_len_ptr (param $id i32) (result i32)  
(i32.load (i32.shl (local.get $id) (i32.const 2)))

)

(;;func arr_data_ptr(id) result;;)
(func $arr_data_ptr (param $id i32) (result i32)  
(i32.add (i32.load (i32.shl (local.get $id) (i32.const 2))) (i32.const 1))

)

(;;func arr_len(id) result;;)
(func $arr_len (param $id i32) (result i32)   ;; length
(i32.load (i32.shl (call $arr_len_ptr (local.get $id)) (i32.const 2)))

)

(;;func arr_clear(id);;)
(func $arr_clear (param $id i32)   ;; length
(i32.store (i32.shl (call $arr_len_ptr (local.get $id)) (i32.const 2)) (i32.const 0))

)

(;;func arr_len_inc(id);;)
(func $arr_len_inc (param $id i32)(local $len_ptr i32)(local $len i32)  
(local.set $len_ptr (call $arr_len_ptr (local.get $id)))
  
(local.set $len (i32.load (i32.shl (local.get $len_ptr) (i32.const 2))))
   ;; substract length
(if (i32.eq (local.get $len) (i32.sub (call $mem_size (local.get $id)) (i32.const 1)))
    (then 
(call $mem_x4 (local.get $id))
    
(local.set $len_ptr (call $arr_len_ptr (local.get $id)))
  ))
(i32.store (i32.shl (local.get $len_ptr) (i32.const 2)) (i32.add (local.get $len) (i32.const 1)))

)

(;;func arr_len_dec(id);;)
(func $arr_len_dec (param $id i32)(local $len_ptr i32)  
(local.set $len_ptr (call $arr_len_ptr (local.get $id)))
  
(i32.store (i32.shl (local.get $len_ptr) (i32.const 2)) (i32.sub (i32.load (i32.shl (local.get $len_ptr) (i32.const 2))) (i32.const 1)))

)

(;;func arr_push(id n);;)
(func $arr_push (param $id i32) (param $n i32)(local $len i32)  
(local.set $len (call $arr_len (local.get $id)))
  
(call $arr_len_inc (local.get $id))
  
(i32.store (i32.shl (i32.add (call $arr_data_ptr (local.get $id)) (local.get $len)) (i32.const 2)) (local.get $n))

)

(;;func arr_pop(id) result;;)
(func $arr_pop (param $id i32) (result i32)(local $len i32)(local $res i32)  
(local.set $len (call $arr_len (local.get $id)))
  
(if (i32.eqz (local.get $len))
    (then 
(local.set $res (i32.const 0))
  )
(else 
    
(local.set $res (i32.load (i32.shl (i32.add (call $arr_data_ptr (local.get $id)) (i32.sub (local.get $len) (i32.const 1))) (i32.const 2))))
    
(call $arr_len_dec (local.get $id))
  ))
(local.get $res)

)

(;;func arr_delete(id index);;)
(func $arr_delete (param $id i32) (param $index i32)(local $len i32)(local $data_ptr i32)  
(local.set $len (call $arr_len (local.get $id)))
  
(if (i32.lt_u (local.get $index) (local.get $len))
    (then 
(if (i32.lt_u (local.get $index) (i32.sub (local.get $len) (i32.const 1)))
      (then 
(local.set $data_ptr (call $arr_data_ptr (local.get $id)))
      
(call $mem_copy (i32.add (local.get $data_ptr) (local.get $index)) (i32.add (local.get $data_ptr) (i32.add (local.get $index) (i32.const 1))) (i32.sub (local.get $len) (i32.sub (local.get $index) (i32.const 1))))
    ))
(call $arr_len_dec (local.get $id))

)))

(;;func arr_get(id index) result;;)
(func $arr_get (param $id i32) (param $index i32) (result i32)(local $len i32)(local $res i32)  
(local.set $len (call $arr_len (local.get $id)))
  
(if (i32.lt_u (local.get $index) (local.get $len))
    (then 
(local.set $res (i32.load (i32.shl (i32.add (call $arr_data_ptr (local.get $id)) (local.get $index)) (i32.const 2))))
  )
(else 
    
(local.set $res (i32.const 0))
  ))
(local.get $res)

)

(;;func arr_set(id index n);;)
(func $arr_set (param $id i32) (param $index i32) (param $n i32)(local $len i32)  
(local.set $len (call $arr_len (local.get $id)))
  
(if (i32.lt_u (local.get $index) (local.get $len))
    (then 
(i32.store (i32.shl (i32.add (call $arr_data_ptr (local.get $id)) (local.get $index)) (i32.const 2)) (local.get $n))

)))

(;;func arr_insert(id index n);;)
(func $arr_insert (param $id i32) (param $index i32) (param $n i32)(local $len i32)(local $offset i32)  
(local.set $len (call $arr_len (local.get $id)))
  
(if (i32.lt_u (local.get $index) (local.get $len))
    (then 
(call $arr_len_inc (local.get $id))
    
(local.set $offset (i32.add (call $arr_data_ptr (local.get $id)) (local.get $index)))
    
(call $mem_copy (i32.add (local.get $offset) (i32.const 1)) (local.get $offset) (i32.sub (local.get $len) (local.get $index)))
    
(i32.store (i32.shl (local.get $offset) (i32.const 2)) (local.get $n))

)))

(;;func arr_free(id);;)
(func $arr_free (param $id i32)  
(call $mem_free (local.get $id))
)

  (;;## import adt/map;;)

;; memory struct
;; 0 index - set of keys
;; 1 index - array of values


(;;func map_create result;;)
(func $map_create  (result i32)(local $id i32)  
(local.set $id (call $mem_alloc (i32.const 2)))
  
(i32.store (i32.shl (call $map_keys_ptr (local.get $id)) (i32.const 2)) (call $set_create))
  
(i32.store (i32.shl (call $map_values_ptr (local.get $id)) (i32.const 2)) (call $arr_create))
  
(local.get $id)

)

(;;func map_keys_ptr(id) result;;)
(func $map_keys_ptr (param $id i32) (result i32)  
(i32.load (i32.shl (local.get $id) (i32.const 2)))

)

(;;func map_values_ptr(id) result;;)
(func $map_values_ptr (param $id i32) (result i32)  
(i32.add (i32.load (i32.shl (local.get $id) (i32.const 2))) (i32.const 1))

)

(;;func map_keys(id) result;;)
(func $map_keys (param $id i32) (result i32)  
(i32.load (i32.shl (call $map_keys_ptr (local.get $id)) (i32.const 2)))

)

(;;func map_values(id) result;;)
(func $map_values (param $id i32) (result i32)  
(i32.load (i32.shl (call $map_values_ptr (local.get $id)) (i32.const 2)))

)

(;;func map_size(id) result;;)
(func $map_size (param $id i32) (result i32)  
(call $set_size (call $map_keys (local.get $id)))

)

(;;func map_clear(id);;)
(func $map_clear (param $id i32)  
(call $set_clear (call $map_keys (local.get $id)))
  
(call $arr_clear (call $map_values (local.get $id)))

)

(;;func map_has(id k) result;;)
(func $map_has (param $id i32) (param $k i32) (result i32)  
(call $set_has (call $map_keys (local.get $id)) (local.get $k))

)

(;;func map_get(id k) result;;)
(func $map_get (param $id i32) (param $k i32) (result i32)(local $keys_id i32)(local $size i32)(local $res i32)(local $i i32)(local $i_k i32)  
(local.set $keys_id (call $map_keys (local.get $id)))
  
(local.set $size (call $set_size (local.get $keys_id)))
  
(if (i32.eqz (local.get $size))
    (then 
(local.set $res (i32.const 0))
  )
(else 
    
(local.set $i (call $set_search (local.get $keys_id) (local.get $k)))
    
(if (i32.eq (local.get $i) (local.get $size))
      (then 
(local.set $res (i32.const 0))
    )
(else 
      
(local.set $i_k (call $set_get_i (local.get $keys_id) (local.get $i)))
      
(if (i32.eq (local.get $k) (local.get $i_k))
        (then 
(local.set $res (call $arr_get (call $map_values (local.get $id)) (local.get $i)))
      )
(else  
(local.set $res (i32.const 0))
  ))))))
(local.get $res)

)

(;;func map_set(id k v);;)
(func $map_set (param $id i32) (param $k i32) (param $v i32)(local $keys_id i32)(local $values_id i32)(local $size i32)(local $i i32)(local $i_k i32)  
(local.set $keys_id (call $map_keys (local.get $id)))
  
(local.set $values_id (call $map_values (local.get $id)))

  
(local.set $size (call $set_size (local.get $keys_id)))
  
(local.set $i (call $set_search (local.get $keys_id) (local.get $k)))

  
(if (i32.eq (local.get $i) (local.get $size))
    (then 
(call $set_insert_i (local.get $keys_id) (local.get $i) (local.get $k))
    
(call $arr_push (local.get $values_id) (local.get $v))
  )
(else 
    
(local.set $i_k (call $set_get_i (local.get $keys_id) (local.get $i)))
    
(if (i32.ne (local.get $k) (local.get $i_k))
      (then 
(call $set_insert_i (local.get $keys_id) (local.get $i) (local.get $k))
      
(call $arr_insert (local.get $values_id) (local.get $i) (local.get $v))
    )
(else 
      
(call $arr_set (local.get $values_id) (local.get $i) (local.get $v))

)))))

(;;func map_delete(id k) result;;)
(func $map_delete (param $id i32) (param $k i32) (result i32)(local $keys_id i32)(local $size i32)(local $res i32)(local $i i32)(local $i_k i32)  
(local.set $keys_id (call $map_keys (local.get $id)))
  
(local.set $size (call $set_size (local.get $keys_id)))
  
(if (i32.eqz (local.get $size))
    (then 
(local.set $res (i32.const 0))
  )
(else 
    
(local.set $i (call $set_search (local.get $keys_id) (local.get $k)))
    
(if (i32.eq (local.get $i) (local.get $size))
      (then 
(local.set $res (i32.const 0))
    )
(else 
      
(local.set $i_k (call $set_get_i (local.get $keys_id) (local.get $i)))
      
(if (i32.ne (local.get $k) (local.get $i_k))
        (then 
(local.set $res (i32.const 0))
      )
(else 
        
(call $set_delete_i (local.get $keys_id) (local.get $i))
        
(call $arr_delete (call $map_values (local.get $id)) (local.get $i))
        
(local.set $res (i32.const 1))
  ))))))
(local.get $res)

)

(;;func map_free(id);;)
(func $map_free (param $id i32)  
(call $mem_free (call $map_keys (local.get $id)))
  
(call $mem_free (call $map_values (local.get $id)))
  
(call $mem_free (local.get $id))
)

  (;;## import adt/debug;;)
(;;## <debug>;;)


(;;## <debug>;;)



  (;;## import seq;;)


(;;global seq_current;;)



(;;func seq_init;;)
(func $seq_init   
(global.set $seq_current (i32.const 0))

)

(;;func seq_next result;;)
(func $seq_next  (result i32)  
(global.set $seq_current (i32.add (global.get $seq_current) (i32.const 1)))
  
(global.get $seq_current)
)

  (;;## import box;;)
(;;## define TICK_DEEP_LIMIT 100;;)
(;;## define DIGEST_LOOP_LIMIT 100;;)


(;;global tick_deep tick_changed;;)


(;;global box_deps box_rels box_invalid box_expr;;)



(;;func box_init;;)
(func $box_init   
(global.set $tick_deep (i32.const 0))
  
(global.set $tick_changed (call $set_create))
  
(global.set $box_deps (call $map_create))
  
(global.set $box_rels (call $map_create))
  
(global.set $box_invalid (call $set_create))
  
(global.set $box_expr (call $set_create))

)

(;;func tick_deep_inc;;)
(func $tick_deep_inc   
(global.set $tick_deep (i32.add (global.get $tick_deep) (i32.const 1)))

)

(;;func tick_deep_dec;;)
(func $tick_deep_dec   
(global.set $tick_deep (i32.sub (global.get $tick_deep) (i32.const 1)))

)

(;;func tick_start;;)
(func $tick_start   
(if (i32.eqz (global.get $tick_deep))
    (then 
(call $set_clear (global.get $tick_changed))

  ))
(call $tick_deep_inc)

  
(if (i32.gt_u (global.get $tick_deep) (i32.const 100))
    (then 
(call $error (i32.const 1))

)))

(;;func box_deep_invalidate(changed_set);;)
(func $box_deep_invalidate (param $changed_set i32)(local $next_set i32)(local $cur_set i32)(local $index_loop_695 i32)(local $size_loop_695 i32)(local $x i32)(local $rels i32)(local $index_loop_769 i32)(local $size_loop_769 i32)(local $r i32)(local $t i32)  
(local.set $next_set (call $set_create))
  
(local.set $cur_set (call $set_create))

  
(call $set_assign (local.get $cur_set) (local.get $changed_set))

  
(loop $loop
    
(;;for x of set cur_set;;)
        (local.set $index_loop_695 (i32.const 0))
        (local.set $size_loop_695 (
          call $set_size (local.get $cur_set)
        ))
        (loop $loop_695
          (if
            (i32.lt_u (local.get $index_loop_695) (local.get $size_loop_695))
            (then
              (local.set $x (
                call $set_get_i (local.get $cur_set) (local.get $index_loop_695)
              ))

              
      
(local.set $rels (call $map_get (global.get $box_rels) (local.get $x)))
      
(if (local.get $rels)
        (then 
(;;for r of set rels;;)
        (local.set $index_loop_769 (i32.const 0))
        (local.set $size_loop_769 (
          call $set_size (local.get $rels)
        ))
        (loop $loop_769
          (if
            (i32.lt_u (local.get $index_loop_769) (local.get $size_loop_769))
            (then
              (local.set $r (
                call $set_get_i (local.get $rels) (local.get $index_loop_769)
              ))

              
          
(call $set_add (global.get $box_invalid) (local.get $r))
          
(call $set_add (local.get $next_set) (local.get $r))

    

              (local.set $index_loop_769 (i32.add
                (local.get $index_loop_769)
                (i32.const 1)
              ))
              (br $loop_769)
            )
          )
        )
        ))

              (local.set $index_loop_695 (i32.add
                (local.get $index_loop_695)
                (i32.const 1)
              ))
              (br $loop_695)
            )
          )
        )
        
(if (call $set_size (local.get $next_set))
      (then 
(local.set $t (local.get $cur_set))
      
(local.set $cur_set (local.get $next_set))
      
(local.set $next_set (local.get $t))
      
(call $set_clear (local.get $next_set))

      
(br $loop)

  )))
(call $set_free (local.get $next_set))
  
(call $set_free (local.get $cur_set))


)

(;;func tick_finish;;)
(func $tick_finish (local $limit i32)(local $index_loop_1268 i32)(local $size_loop_1268 i32)(local $x i32)  
(if (i32.or (i32.gt_u (global.get $tick_deep) (i32.const 1)) (i32.eqz (call $set_size (global.get $tick_changed))))
    (then 
(call $tick_deep_dec)
    
(return)

  ))
(local.set $limit (i32.const 100))
  
(loop $loop
    
(local.set $limit (i32.sub (local.get $limit) (i32.const 1)))
    
(if (local.get $limit)
      (then 
(call $box_deep_invalidate (global.get $tick_changed))
      
(call $set_clear (global.get $tick_changed))

      
(;;for x of set box_invalid;;)
        (local.set $index_loop_1268 (i32.const 0))
        (local.set $size_loop_1268 (
          call $set_size (global.get $box_invalid)
        ))
        (loop $loop_1268
          (if
            (i32.lt_u (local.get $index_loop_1268) (local.get $size_loop_1268))
            (then
              (local.set $x (
                call $set_get_i (global.get $box_invalid) (local.get $index_loop_1268)
              ))

              
        
(if (call $set_has (global.get $box_expr) (local.get $x))
          (then 
(call $call (local.get $x))

      ))

              (local.set $index_loop_1268 (i32.add
                (local.get $index_loop_1268)
                (i32.const 1)
              ))
              (br $loop_1268)
            )
          )
        )
        
(if (call $set_size (global.get $tick_changed))
        (then 
(br $loop)

  )))))
(call $tick_deep_dec)
  
(if (i32.eqz (local.get $limit))
    (then 
(call $error (i32.const 2))

)))

(;;func box_create result;;)
(func $box_create  (result i32)  
(call $seq_next)

)

(;;func slice_deps_open(id);;)
(func $slice_deps_open (param $id i32)(local $arr i32)  
(local.set $arr (call $arr_create))
  
(call $arr_push (local.get $arr) (i32.const 0))



)

(;;func box_expr_create result;;)
(func $box_expr_create  (result i32)  
(call $box_create)

)

(;;func box_expr_start(id);;)
(func $box_expr_start (param $id i32)
)

(;;func box_expr_finish;;)
(func $box_expr_finish 







)

(;;func box_value_create result;;)
(func $box_value_create  (result i32)  
(i32.const 0)

)

(;;func box_value_get_phase(id);;)
(func $box_value_get_phase (param $id i32)
)

(;;func box_value_set_phase(id);;)
(func $box_value_set_phase (param $id i32)
)

(;;func box_computed_create result;;)
(func $box_computed_create  (result i32)  
(i32.const 0)

)

(;;func box_computed_start(id) result;;)
(func $box_computed_start (param $id i32) (result i32)  
(i32.const 0)

)

(;;func box_computed_finish;;)
(func $box_computed_finish 
)

(;;func box_entry_start;;)
(func $box_entry_start 
)

(;;func box_entry_finish;;)
(func $box_entry_finish 
)

(;;func box_view_create result;;)
(func $box_view_create  (result i32)  
(i32.const 0)

)

(;;func box_view_start(id);;)
(func $box_view_start (param $id i32)
)

(;;func box_view_finish;;)
(func $box_view_finish 

)
(export \\"b0\\" (func $box_value_create))
(export \\"b1\\" (func $box_value_get_phase))
(export \\"b2\\" (func $box_value_set_phase))
(export \\"b3\\" (func $box_expr_create))
(export \\"b4\\" (func $box_expr_start))
(export \\"b5\\" (func $box_expr_finish))
(export \\"b6\\" (func $box_computed_create))
(export \\"b7\\" (func $box_computed_start))
(export \\"b8\\" (func $box_computed_finish))
(export \\"b9\\" (func $box_entry_start))
(export \\"ba\\" (func $box_entry_finish))
(export \\"bb\\" (func $box_view_create))
(export \\"bc\\" (func $box_view_start))
(export \\"bd\\" (func $box_view_finish))

(;;## <debug>;;)


(;;## <debug>;;)



  (start $start)

  (;;## <debug>;;)

)
"
`;

exports[`should work bool operations 1`] = `
"

(;;func tick_finish;;)
(func $tick_finish   
(if (i32.or (i32.gt_u (call $tick_deep) (i32.const 1)) (i32.eqz (call $set_size (call $tick_changed))))
    (then 
(i32.store (i32.shl (call $tick_deep_ptr) (i32.const 2)) (i32.sub (call $tick_deep) (i32.const 1)))
  )))
"
`;

exports[`should work for section for set 1`] = `
"

(;;func a(k);;)
(func $a (param $k i32)(local $index_loop_28 i32)(local $size_loop_28 i32)(local $index_loop_47 i32)(local $size_loop_47 i32)(local $n i32)(local $j i32)  
(;;for n of set k;;)
        (local.set $index_loop_28 (i32.const 0))
        (local.set $size_loop_28 (
          call $set_size (local.get $k)
        ))
        (loop $loop_28
          (if
            (i32.lt_u (local.get $index_loop_28) (local.get $size_loop_28))
            (then
              (local.set $n (
                call $set_get_i (local.get $k) (local.get $index_loop_28)
              ))

              
    
(;;for j of set n;;)
        (local.set $index_loop_47 (i32.const 0))
        (local.set $size_loop_47 (
          call $set_size (local.get $n)
        ))
        (loop $loop_47
          (if
            (i32.lt_u (local.get $index_loop_47) (local.get $size_loop_47))
            (then
              (local.set $j (
                call $set_get_i (local.get $n) (local.get $index_loop_47)
              ))

              
      
(call $log_2 (local.get $n) (local.get $j))
  

              (local.set $index_loop_47 (i32.add
                (local.get $index_loop_47)
                (i32.const 1)
              ))
              (br $loop_47)
            )
          )
        )
        

              (local.set $index_loop_28 (i32.add
                (local.get $index_loop_28)
                (i32.const 1)
              ))
              (br $loop_28)
            )
          )
        )
        )
"
`;

exports[`should work global op 1`] = `
"

(;;global a b c;;)
(global $a (mut i32) (i32.const 0))
(global $b (mut i32) (i32.const 0))
(global $c (mut i32) (i32.const 0))
(global $e (mut i32) (i32.const 0))
(global $f1 (mut i32) (i32.const 0))
(global $a_5 (mut i32) (i32.const 0))
(global $t (mut i32) (i32.const 0))

(;;global e f1 a_5;;)



(;;func func1 result;;)
(func $func1  (result i32)(local $m i32)  
(local.set $m (i32.const 10))
  
(i32.add (global.get $e) (i32.add (global.get $f1) (i32.add (global.get $a_5) (i32.add (global.get $a) (i32.add (global.get $b) (i32.add (global.get $c) (i32.add (local.get $m) (global.get $t))))))))

)

(;;global t;;)



(;;func func2 result;;)
(func $func2  (result i32)(local $m i32)(local $l i32)(local $p i32)  
(local.set $m (i32.const 10))
  
(local.set $l (i32.const 11))
  
(local.set $p (i32.const 15))
  
(i32.add (global.get $a) (i32.add (local.get $m) (i32.add (local.get $l) (i32.add (global.get $f1) (i32.add (local.get $p) (global.get $t))))))

)

(;;func func3;;)
(func $func3 (local $index_loop_203 i32)(local $size_loop_203 i32)(local $x i32)  
(;;for x of set a;;)
        (local.set $index_loop_203 (i32.const 0))
        (local.set $size_loop_203 (
          call $set_size (global.get $a)
        ))
        (loop $loop_203
          (if
            (i32.lt_u (local.get $index_loop_203) (local.get $size_loop_203))
            (then
              (local.set $x (
                call $set_get_i (global.get $a) (local.get $index_loop_203)
              ))

              
    
(call $call (i32.add (local.get $x) (global.get $c)))
  

              (local.set $index_loop_203 (i32.add
                (local.get $index_loop_203)
                (i32.const 1)
              ))
              (br $loop_203)
            )
          )
        )
        )
"
`;

exports[`should work return op 1`] = `
"

(;;func a;;)
(func $a   
(return)
  )
"
`;
