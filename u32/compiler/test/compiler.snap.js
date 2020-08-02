// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`should work 1`] = `
"(;;## import code/index;;)
(module
  (import \\"env\\" \\"memory\\" (memory 1))

  (;;## import debug;;)
(;;## <debug>;;)


  (;;## import seq_id;;)
(;;## define SEQ_ID_ADR 4;;)


(;;func seq_id_init;;)
(func $seq_id_init   ;; TODO: Replace to data section with initial values
  
(i32.store (i32.shl (i32.const 4) (i32.const 2)) (i32.const 0))

)

(;;func seq_id_next result;;)
(func $seq_id_next  (result i32)(local $id i32)  
(local.set $id (i32.add (i32.load (i32.shl (i32.const 4) (i32.const 2))) (i32.const 1)))
  
(i32.store (i32.shl (i32.const 4) (i32.const 2)) (local.get $id))
  
(local.get $id)

)

  (;;## import set;;)
(;;## define SET_ELM_SIZE 4;;)
(;;## define SET_HEAD_SIZE 4;;)

;; Set memory struct
;; 0 - size
;; [1..size)


(;;func set_create result;;)
(func $set_create  (result i32)   ;; Each set 128 bytes by default
(i32.shl (call $seq_id_next) (i32.const 7))


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

(;;func set_size(id) result;;)
(func $set_size (param $id i32) (result i32)  
(i32.load (i32.shl (local.get $id) (i32.const 2)))


)

(;;func set_insert_i(id index n);;)
(func $set_insert_i (param $id i32) (param $index i32) (param $n i32)(local $size i32)(local $offset_index i32)(local $offset i32)  
(local.set $size (call $set_size (local.get $id)))
  
(if (i32.eq (local.get $index) (local.get $size))
    (then 
(i32.store (i32.shl (call $set_offset_i (local.get $id) (local.get $index)) (i32.const 2)) (local.get $n))
    
(i32.store (i32.shl (local.get $id) (i32.const 2)) (i32.add (local.get $size) (i32.const 1)))
  )
(else 
    
(local.set $offset_index (call $set_offset_i (local.get $id) (local.get $index)))
    
(local.set $offset (call $set_offset_i (local.get $id) (i32.sub (local.get $size) (i32.const 1))))
    
(loop $loop
      
(i32.store (i32.shl (i32.add (local.get $offset) (i32.const 4)) (i32.const 2)) (i32.load (i32.shl (local.get $offset) (i32.const 2))))
      
(if (i32.ne (local.get $offset) (local.get $offset_index))
        (then 
(local.set $offset (i32.sub (local.get $offset) (i32.const 4)))
        
(br $loop)
    )))
(i32.store (i32.shl (local.get $offset_index) (i32.const 2)) (local.get $n))
    
(i32.store (i32.shl (local.get $id) (i32.const 2)) (i32.add (local.get $size) (i32.const 1)))


)))

(;;func set_delete_i(id index);;)
(func $set_delete_i (param $id i32) (param $index i32)(local $size i32)(local $curr i32)(local $to i32)  
(local.set $size (call $set_size (local.get $id)))
  
(if (i32.ne (local.get $size) (i32.const 1))
    (then 
(local.set $curr (call $set_offset_i (local.get $id) (local.get $index)))
    
(local.set $to (call $set_offset_i (local.get $id) (i32.sub (local.get $size) (i32.const 1))))

    
(if (i32.ne (local.get $curr) (local.get $to))
      (then 
(loop $loop
        
(i32.store (i32.shl (local.get $curr) (i32.const 2)) (i32.load (i32.shl (i32.add (local.get $curr) (i32.const 4)) (i32.const 2))))
        
(if (i32.ne (i32.add (local.get $curr) (i32.const 4)) (local.get $to))
          (then 
(local.set $curr (i32.add (local.get $curr) (i32.const 4)))
          
(br $loop)
  )))))))
(i32.store (i32.shl (local.get $id) (i32.const 2)) (i32.sub (local.get $size) (i32.const 1)))


)

(;;func set_offset_i(id index) result;;)
(func $set_offset_i (param $id i32) (param $index i32) (result i32)  
(i32.add (local.get $id) (i32.add (i32.const 4) (i32.shl (local.get $index) (i32.const 2))))


)

(;;func set_get_i(id index) result;;)
(func $set_get_i (param $id i32) (param $index i32) (result i32)  
(i32.load (i32.shl (call $set_offset_i (local.get $id) (local.get $index)) (i32.const 2)))


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

(;;func set_free(id) result;;)
(func $set_free (param $id i32) (result i32)  
(i32.load (i32.shl (local.get $id) (i32.const 2)))

)


  (export \\"seq_id_init\\" (func $seq_id_init))

  (export \\"set_create\\" (func $set_create))
  (export \\"set_add\\" (func $set_add))
  (export \\"set_has\\" (func $set_has))
  (export \\"set_delete\\" (func $set_delete))
  (export \\"set_size\\" (func $set_size))
  (export \\"set_free\\" (func $set_free))
)
"
`;
