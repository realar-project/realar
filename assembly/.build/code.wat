(module
 (type $none_=>_none (func))
 (type $i32_=>_none (func (param i32)))
 (type $i32_i32_=>_none (func (param i32 i32)))
 (type $i32_i32_=>_i32 (func (param i32 i32) (result i32)))
 (type $none_=>_i32 (func (result i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (type $i32_i32_i32_=>_none (func (param i32 i32 i32)))
 (type $i32_i32_i32_=>_i32 (func (param i32 i32 i32) (result i32)))
 (type $i32_i32_i32_i32_=>_none (func (param i32 i32 i32 i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (import "env" "error" (func $lib/core/assembly/error/error (param i32)))
 (import "env" "call" (func $lib/core/assembly/call/call (param i32)))
 (memory $0 1)
 (data (i32.const 1028) "\01")
 (data (i32.const 1044) "\01")
 (data (i32.const 1056) "\1c\00\00\00\01\00\00\00\01\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h")
 (data (i32.const 1104) "&\00\00\00\01\00\00\00\01\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s")
 (data (i32.const 1172) "\01")
 (data (i32.const 1184) "\1c\00\00\00\01\00\00\00\01\00\00\00\1c\00\00\00A\00r\00r\00a\00y\00 \00i\00s\00 \00e\00m\00p\00t\00y")
 (data (i32.const 1232) "\1a\00\00\00\01\00\00\00\01\00\00\00\1a\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00.\00t\00s")
 (data (i32.const 1284) "\01")
 (data (i32.const 1296) "$\00\00\00\01\00\00\00\01\00\00\00$\00\00\00I\00n\00d\00e\00x\00 \00o\00u\00t\00 \00o\00f\00 \00r\00a\00n\00g\00e")
 (data (i32.const 1360) "$\00\00\00\01\00\00\00\01\00\00\00$\00\00\00K\00e\00y\00 \00d\00o\00e\00s\00 \00n\00o\00t\00 \00e\00x\00i\00s\00t")
 (data (i32.const 1424) "\16\00\00\00\01\00\00\00\01\00\00\00\16\00\00\00~\00l\00i\00b\00/\00m\00a\00p\00.\00t\00s")
 (global $lib/core/assembly/seq/seq_slice_stack (mut i32) (i32.const 0))
 (global $lib/core/assembly/seq/seq_current (mut i32) (i32.const 0))
 (global $lib/core/assembly/box/box_slice_stack (mut i32) (i32.const 0))
 (global $lib/core/assembly/box/tick_deep (mut i32) (i32.const 0))
 (global $lib/core/assembly/box/tick_changed (mut i32) (i32.const 0))
 (global $lib/core/assembly/box/slice_deps_stack (mut i32) (i32.const 0))
 (global $lib/core/assembly/box/slice_deps (mut i32) (i32.const 0))
 (global $lib/core/assembly/box/slice_current_id (mut i32) (i32.const 0))
 (global $lib/core/assembly/box/box_deps (mut i32) (i32.const 0))
 (global $lib/core/assembly/box/box_rels (mut i32) (i32.const 0))
 (global $lib/core/assembly/box/box_invalid (mut i32) (i32.const 0))
 (global $lib/core/assembly/box/box_expr (mut i32) (i32.const 0))
 (global $lib/core/assembly/box/box_entry_id (mut i32) (i32.const 0))
 (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
 (export "memory" (memory $0))
 (export "start" (func $lib/core/assembly/slice/start))
 (export "pop" (func $lib/core/assembly/slice/pop))
 (export "push" (func $lib/core/assembly/slice/push))
 (export "b0" (func $lib/core/assembly/box/box_value_create))
 (export "b1" (func $lib/core/assembly/box/box_value_get_phase))
 (export "b2" (func $lib/core/assembly/box/box_value_set_phase))
 (export "b3" (func $lib/core/assembly/box/box_expr_create))
 (export "b4" (func $lib/core/assembly/box/box_expr_start))
 (export "b5" (func $lib/core/assembly/box/box_expr_finish))
 (export "b6" (func $lib/core/assembly/box/box_computed_create))
 (export "b7" (func $lib/core/assembly/box/box_computed_start))
 (export "b8" (func $lib/core/assembly/box/box_computed_finish))
 (export "b9" (func $lib/core/assembly/box/box_entry_start))
 (export "ba" (func $lib/core/assembly/box/box_entry_finish))
 (export "bb" (func $lib/core/assembly/box/box_view_create))
 (export "bc" (func $~lib/rt/stub/__release))
 (export "bd" (func $lib/core/assembly/box/box_view_finish))
 (start $~start)
 (func $~lib/rt/stub/__alloc (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $0
  i32.const 1073741808
  i32.gt_u
  if
   unreachable
  end
  global.get $~lib/rt/stub/offset
  i32.const 16
  i32.add
  local.tee $4
  local.get $0
  i32.const 15
  i32.add
  i32.const -16
  i32.and
  local.tee $2
  i32.const 16
  local.get $2
  i32.const 16
  i32.gt_u
  select
  local.tee $6
  i32.add
  local.tee $2
  memory.size
  local.tee $5
  i32.const 16
  i32.shl
  local.tee $3
  i32.gt_u
  if
   local.get $5
   local.get $2
   local.get $3
   i32.sub
   i32.const 65535
   i32.add
   i32.const -65536
   i32.and
   i32.const 16
   i32.shr_u
   local.tee $3
   local.get $5
   local.get $3
   i32.gt_s
   select
   memory.grow
   i32.const 0
   i32.lt_s
   if
    local.get $3
    memory.grow
    i32.const 0
    i32.lt_s
    if
     unreachable
    end
   end
  end
  local.get $2
  global.set $~lib/rt/stub/offset
  local.get $4
  i32.const 16
  i32.sub
  local.tee $2
  local.get $6
  i32.store
  local.get $2
  i32.const 1
  i32.store offset=4
  local.get $2
  local.get $1
  i32.store offset=8
  local.get $2
  local.get $0
  i32.store offset=12
  local.get $4
 )
 (func $~lib/util/memory/memcpy (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  loop $while-continue|0
   local.get $1
   i32.const 3
   i32.and
   i32.const 0
   local.get $2
   select
   if
    local.get $0
    local.tee $3
    i32.const 1
    i32.add
    local.set $0
    local.get $1
    local.tee $4
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    local.get $4
    i32.load8_u
    i32.store8
    local.get $2
    i32.const 1
    i32.sub
    local.set $2
    br $while-continue|0
   end
  end
  local.get $0
  i32.const 3
  i32.and
  i32.eqz
  if
   loop $while-continue|1
    local.get $2
    i32.const 16
    i32.ge_u
    if
     local.get $0
     local.get $1
     i32.load
     i32.store
     local.get $0
     local.get $1
     i32.load offset=4
     i32.store offset=4
     local.get $0
     local.get $1
     i32.load offset=8
     i32.store offset=8
     local.get $0
     local.get $1
     i32.load offset=12
     i32.store offset=12
     local.get $1
     i32.const 16
     i32.add
     local.set $1
     local.get $0
     i32.const 16
     i32.add
     local.set $0
     local.get $2
     i32.const 16
     i32.sub
     local.set $2
     br $while-continue|1
    end
   end
   local.get $2
   i32.const 8
   i32.and
   if
    local.get $0
    local.get $1
    i32.load
    i32.store
    local.get $0
    local.get $1
    i32.load offset=4
    i32.store offset=4
    local.get $1
    i32.const 8
    i32.add
    local.set $1
    local.get $0
    i32.const 8
    i32.add
    local.set $0
   end
   local.get $2
   i32.const 4
   i32.and
   if
    local.get $0
    local.get $1
    i32.load
    i32.store
    local.get $1
    i32.const 4
    i32.add
    local.set $1
    local.get $0
    i32.const 4
    i32.add
    local.set $0
   end
   local.get $2
   i32.const 2
   i32.and
   if
    local.get $0
    local.get $1
    i32.load16_u
    i32.store16
    local.get $1
    i32.const 2
    i32.add
    local.set $1
    local.get $0
    i32.const 2
    i32.add
    local.set $0
   end
   local.get $2
   i32.const 1
   i32.and
   if
    local.get $0
    local.get $1
    i32.load8_u
    i32.store8
   end
   return
  end
  local.get $2
  i32.const 32
  i32.ge_u
  if
   block $break|2
    block $case2|2
     block $case1|2
      block $case0|2
       local.get $0
       i32.const 3
       i32.and
       i32.const 1
       i32.sub
       br_table $case0|2 $case1|2 $case2|2 $break|2
      end
      local.get $1
      i32.load
      local.set $5
      local.get $0
      local.get $1
      i32.load8_u
      i32.store8
      local.get $0
      i32.const 1
      i32.add
      local.tee $0
      local.get $1
      i32.const 1
      i32.add
      local.tee $1
      i32.load8_u
      i32.store8
      local.get $0
      local.tee $4
      i32.const 2
      i32.add
      local.set $0
      local.get $1
      local.tee $3
      i32.const 2
      i32.add
      local.set $1
      local.get $4
      local.get $3
      i32.load8_u offset=1
      i32.store8 offset=1
      local.get $2
      i32.const 3
      i32.sub
      local.set $2
      loop $while-continue|3
       local.get $2
       i32.const 17
       i32.ge_u
       if
        local.get $0
        local.get $1
        i32.load offset=1
        local.tee $3
        i32.const 8
        i32.shl
        local.get $5
        i32.const 24
        i32.shr_u
        i32.or
        i32.store
        local.get $0
        local.get $3
        i32.const 24
        i32.shr_u
        local.get $1
        i32.load offset=5
        local.tee $3
        i32.const 8
        i32.shl
        i32.or
        i32.store offset=4
        local.get $0
        local.get $3
        i32.const 24
        i32.shr_u
        local.get $1
        i32.load offset=9
        local.tee $3
        i32.const 8
        i32.shl
        i32.or
        i32.store offset=8
        local.get $0
        local.get $1
        i32.load offset=13
        local.tee $5
        i32.const 8
        i32.shl
        local.get $3
        i32.const 24
        i32.shr_u
        i32.or
        i32.store offset=12
        local.get $1
        i32.const 16
        i32.add
        local.set $1
        local.get $0
        i32.const 16
        i32.add
        local.set $0
        local.get $2
        i32.const 16
        i32.sub
        local.set $2
        br $while-continue|3
       end
      end
      br $break|2
     end
     local.get $1
     i32.load
     local.set $5
     local.get $0
     local.get $1
     i32.load8_u
     i32.store8
     local.get $0
     local.tee $4
     i32.const 2
     i32.add
     local.set $0
     local.get $1
     local.tee $3
     i32.const 2
     i32.add
     local.set $1
     local.get $4
     local.get $3
     i32.load8_u offset=1
     i32.store8 offset=1
     local.get $2
     i32.const 2
     i32.sub
     local.set $2
     loop $while-continue|4
      local.get $2
      i32.const 18
      i32.ge_u
      if
       local.get $0
       local.get $1
       i32.load offset=2
       local.tee $3
       i32.const 16
       i32.shl
       local.get $5
       i32.const 16
       i32.shr_u
       i32.or
       i32.store
       local.get $0
       local.get $3
       i32.const 16
       i32.shr_u
       local.get $1
       i32.load offset=6
       local.tee $3
       i32.const 16
       i32.shl
       i32.or
       i32.store offset=4
       local.get $0
       local.get $3
       i32.const 16
       i32.shr_u
       local.get $1
       i32.load offset=10
       local.tee $3
       i32.const 16
       i32.shl
       i32.or
       i32.store offset=8
       local.get $0
       local.get $1
       i32.load offset=14
       local.tee $5
       i32.const 16
       i32.shl
       local.get $3
       i32.const 16
       i32.shr_u
       i32.or
       i32.store offset=12
       local.get $1
       i32.const 16
       i32.add
       local.set $1
       local.get $0
       i32.const 16
       i32.add
       local.set $0
       local.get $2
       i32.const 16
       i32.sub
       local.set $2
       br $while-continue|4
      end
     end
     br $break|2
    end
    local.get $1
    i32.load
    local.set $5
    local.get $0
    local.tee $3
    i32.const 1
    i32.add
    local.set $0
    local.get $1
    local.tee $4
    i32.const 1
    i32.add
    local.set $1
    local.get $3
    local.get $4
    i32.load8_u
    i32.store8
    local.get $2
    i32.const 1
    i32.sub
    local.set $2
    loop $while-continue|5
     local.get $2
     i32.const 19
     i32.ge_u
     if
      local.get $0
      local.get $1
      i32.load offset=3
      local.tee $3
      i32.const 24
      i32.shl
      local.get $5
      i32.const 8
      i32.shr_u
      i32.or
      i32.store
      local.get $0
      local.get $3
      i32.const 8
      i32.shr_u
      local.get $1
      i32.load offset=7
      local.tee $3
      i32.const 24
      i32.shl
      i32.or
      i32.store offset=4
      local.get $0
      local.get $3
      i32.const 8
      i32.shr_u
      local.get $1
      i32.load offset=11
      local.tee $3
      i32.const 24
      i32.shl
      i32.or
      i32.store offset=8
      local.get $0
      local.get $1
      i32.load offset=15
      local.tee $5
      i32.const 24
      i32.shl
      local.get $3
      i32.const 8
      i32.shr_u
      i32.or
      i32.store offset=12
      local.get $1
      i32.const 16
      i32.add
      local.set $1
      local.get $0
      i32.const 16
      i32.add
      local.set $0
      local.get $2
      i32.const 16
      i32.sub
      local.set $2
      br $while-continue|5
     end
    end
   end
  end
  local.get $2
  i32.const 16
  i32.and
  if
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $4
   i32.const 2
   i32.add
   local.set $0
   local.get $1
   local.tee $3
   i32.const 2
   i32.add
   local.set $1
   local.get $4
   local.get $3
   i32.load8_u offset=1
   i32.store8 offset=1
  end
  local.get $2
  i32.const 8
  i32.and
  if
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $4
   i32.const 2
   i32.add
   local.set $0
   local.get $1
   local.tee $3
   i32.const 2
   i32.add
   local.set $1
   local.get $4
   local.get $3
   i32.load8_u offset=1
   i32.store8 offset=1
  end
  local.get $2
  i32.const 4
  i32.and
  if
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   i32.const 1
   i32.add
   local.tee $0
   local.get $1
   i32.const 1
   i32.add
   local.tee $1
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $4
   i32.const 2
   i32.add
   local.set $0
   local.get $1
   local.tee $3
   i32.const 2
   i32.add
   local.set $1
   local.get $4
   local.get $3
   i32.load8_u offset=1
   i32.store8 offset=1
  end
  local.get $2
  i32.const 2
  i32.and
  if
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
   local.get $0
   local.tee $4
   i32.const 2
   i32.add
   local.set $0
   local.get $1
   local.tee $3
   i32.const 2
   i32.add
   local.set $1
   local.get $4
   local.get $3
   i32.load8_u offset=1
   i32.store8 offset=1
  end
  local.get $2
  i32.const 1
  i32.and
  if
   local.get $0
   local.get $1
   i32.load8_u
   i32.store8
  end
 )
 (func $~lib/memory/memory.copy (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  block $~lib/util/memory/memmove|inlined.0
   local.get $2
   local.set $4
   local.get $0
   local.get $1
   i32.eq
   br_if $~lib/util/memory/memmove|inlined.0
   local.get $1
   local.get $0
   i32.sub
   local.get $4
   i32.sub
   i32.const 0
   local.get $4
   i32.const 1
   i32.shl
   i32.sub
   i32.le_u
   if
    local.get $0
    local.get $1
    local.get $4
    call $~lib/util/memory/memcpy
    br $~lib/util/memory/memmove|inlined.0
   end
   local.get $0
   local.get $1
   i32.lt_u
   if
    local.get $1
    i32.const 7
    i32.and
    local.get $0
    i32.const 7
    i32.and
    i32.eq
    if
     loop $while-continue|0
      local.get $0
      i32.const 7
      i32.and
      if
       local.get $4
       i32.eqz
       br_if $~lib/util/memory/memmove|inlined.0
       local.get $4
       i32.const 1
       i32.sub
       local.set $4
       local.get $0
       local.tee $2
       i32.const 1
       i32.add
       local.set $0
       local.get $1
       local.tee $3
       i32.const 1
       i32.add
       local.set $1
       local.get $2
       local.get $3
       i32.load8_u
       i32.store8
       br $while-continue|0
      end
     end
     loop $while-continue|1
      local.get $4
      i32.const 8
      i32.ge_u
      if
       local.get $0
       local.get $1
       i64.load
       i64.store
       local.get $4
       i32.const 8
       i32.sub
       local.set $4
       local.get $0
       i32.const 8
       i32.add
       local.set $0
       local.get $1
       i32.const 8
       i32.add
       local.set $1
       br $while-continue|1
      end
     end
    end
    loop $while-continue|2
     local.get $4
     if
      local.get $0
      local.tee $2
      i32.const 1
      i32.add
      local.set $0
      local.get $1
      local.tee $3
      i32.const 1
      i32.add
      local.set $1
      local.get $2
      local.get $3
      i32.load8_u
      i32.store8
      local.get $4
      i32.const 1
      i32.sub
      local.set $4
      br $while-continue|2
     end
    end
   else
    local.get $1
    i32.const 7
    i32.and
    local.get $0
    i32.const 7
    i32.and
    i32.eq
    if
     loop $while-continue|3
      local.get $0
      local.get $4
      i32.add
      i32.const 7
      i32.and
      if
       local.get $4
       i32.eqz
       br_if $~lib/util/memory/memmove|inlined.0
       local.get $4
       i32.const 1
       i32.sub
       local.tee $4
       local.get $0
       i32.add
       local.get $1
       local.get $4
       i32.add
       i32.load8_u
       i32.store8
       br $while-continue|3
      end
     end
     loop $while-continue|4
      local.get $4
      i32.const 8
      i32.ge_u
      if
       local.get $4
       i32.const 8
       i32.sub
       local.tee $4
       local.get $0
       i32.add
       local.get $1
       local.get $4
       i32.add
       i64.load
       i64.store
       br $while-continue|4
      end
     end
    end
    loop $while-continue|5
     local.get $4
     if
      local.get $4
      i32.const 1
      i32.sub
      local.tee $4
      local.get $0
      i32.add
      local.get $1
      local.get $4
      i32.add
      i32.load8_u
      i32.store8
      br $while-continue|5
     end
    end
   end
  end
 )
 (func $~lib/rt/__allocArray (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  i32.const 16
  local.get $0
  call $~lib/rt/stub/__alloc
  local.tee $0
  i32.const 0
  i32.const 0
  call $~lib/rt/stub/__alloc
  local.set $2
  local.get $1
  if
   local.get $2
   local.get $1
   i32.const 0
   call $~lib/memory/memory.copy
  end
  local.get $2
  i32.store
  local.get $0
  local.get $2
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.store offset=8
  local.get $0
  i32.const 0
  i32.store offset=12
  local.get $0
 )
 (func $~lib/rt/stub/__release (param $0 i32)
  nop
 )
 (func $~lib/memory/memory.fill (param $0 i32) (param $1 i32)
  (local $2 i32)
  block $~lib/util/memory/memset|inlined.0
   local.get $1
   i32.eqz
   br_if $~lib/util/memory/memset|inlined.0
   local.get $0
   i32.const 0
   i32.store8
   local.get $0
   local.get $1
   i32.add
   i32.const 4
   i32.sub
   local.tee $2
   i32.const 0
   i32.store8 offset=3
   local.get $1
   i32.const 2
   i32.le_u
   br_if $~lib/util/memory/memset|inlined.0
   local.get $0
   i32.const 0
   i32.store8 offset=1
   local.get $0
   i32.const 0
   i32.store8 offset=2
   local.get $2
   i32.const 0
   i32.store8 offset=2
   local.get $2
   i32.const 0
   i32.store8 offset=1
   local.get $1
   i32.const 6
   i32.le_u
   br_if $~lib/util/memory/memset|inlined.0
   local.get $0
   i32.const 0
   i32.store8 offset=3
   local.get $2
   i32.const 0
   i32.store8
   local.get $1
   i32.const 8
   i32.le_u
   br_if $~lib/util/memory/memset|inlined.0
   local.get $0
   i32.const 0
   local.get $0
   i32.sub
   i32.const 3
   i32.and
   local.tee $2
   i32.add
   local.tee $0
   i32.const 0
   i32.store
   local.get $0
   local.get $1
   local.get $2
   i32.sub
   i32.const -4
   i32.and
   local.tee $2
   i32.add
   i32.const 28
   i32.sub
   local.tee $1
   i32.const 0
   i32.store offset=24
   local.get $2
   i32.const 8
   i32.le_u
   br_if $~lib/util/memory/memset|inlined.0
   local.get $0
   i32.const 0
   i32.store offset=4
   local.get $0
   i32.const 0
   i32.store offset=8
   local.get $1
   i32.const 0
   i32.store offset=16
   local.get $1
   i32.const 0
   i32.store offset=20
   local.get $2
   i32.const 24
   i32.le_u
   br_if $~lib/util/memory/memset|inlined.0
   local.get $0
   i32.const 0
   i32.store offset=12
   local.get $0
   i32.const 0
   i32.store offset=16
   local.get $0
   i32.const 0
   i32.store offset=20
   local.get $0
   i32.const 0
   i32.store offset=24
   local.get $1
   i32.const 0
   i32.store
   local.get $1
   i32.const 0
   i32.store offset=4
   local.get $1
   i32.const 0
   i32.store offset=8
   local.get $1
   i32.const 0
   i32.store offset=12
   local.get $0
   local.get $0
   i32.const 4
   i32.and
   i32.const 24
   i32.add
   local.tee $1
   i32.add
   local.set $0
   local.get $2
   local.get $1
   i32.sub
   local.set $1
   loop $while-continue|0
    local.get $1
    i32.const 32
    i32.ge_u
    if
     local.get $0
     i64.const 0
     i64.store
     local.get $0
     i64.const 0
     i64.store offset=8
     local.get $0
     i64.const 0
     i64.store offset=16
     local.get $0
     i64.const 0
     i64.store offset=24
     local.get $1
     i32.const 32
     i32.sub
     local.set $1
     local.get $0
     i32.const 32
     i32.add
     local.set $0
     br $while-continue|0
    end
   end
  end
 )
 (func $~lib/arraybuffer/ArrayBuffer#constructor (param $0 i32) (result i32)
  (local $1 i32)
  local.get $0
  i32.const 1073741808
  i32.gt_u
  if
   i32.const 1072
   i32.const 1120
   i32.const 49
   i32.const 43
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.const 0
  call $~lib/rt/stub/__alloc
  local.tee $1
  local.get $0
  call $~lib/memory/memory.fill
  local.get $1
 )
 (func $~lib/set/Set<i32>#constructor (result i32)
  (local $0 i32)
  i32.const 24
  i32.const 4
  call $~lib/rt/stub/__alloc
  local.tee $0
  i32.const 16
  call $~lib/arraybuffer/ArrayBuffer#constructor
  i32.store
  local.get $0
  i32.const 3
  i32.store offset=4
  local.get $0
  i32.const 32
  call $~lib/arraybuffer/ArrayBuffer#constructor
  i32.store offset=8
  local.get $0
  i32.const 4
  i32.store offset=12
  local.get $0
  i32.const 0
  i32.store offset=16
  local.get $0
  i32.const 0
  i32.store offset=20
  local.get $0
 )
 (func $~lib/map/Map<i32,~lib/set/Set<i32>>#constructor (result i32)
  (local $0 i32)
  i32.const 24
  i32.const 6
  call $~lib/rt/stub/__alloc
  local.tee $0
  i32.const 16
  call $~lib/arraybuffer/ArrayBuffer#constructor
  i32.store
  local.get $0
  i32.const 3
  i32.store offset=4
  local.get $0
  i32.const 48
  call $~lib/arraybuffer/ArrayBuffer#constructor
  i32.store offset=8
  local.get $0
  i32.const 4
  i32.store offset=12
  local.get $0
  i32.const 0
  i32.store offset=16
  local.get $0
  i32.const 0
  i32.store offset=20
  local.get $0
 )
 (func $lib/core/assembly/slice/start
  i32.const 3
  i32.const 1040
  call $~lib/rt/__allocArray
  global.set $lib/core/assembly/seq/seq_slice_stack
  i32.const 0
  global.set $lib/core/assembly/seq/seq_current
  i32.const 7
  i32.const 1056
  call $~lib/rt/__allocArray
  global.set $lib/core/assembly/box/box_slice_stack
  i32.const 0
  global.set $lib/core/assembly/box/tick_deep
  call $~lib/set/Set<i32>#constructor
  global.set $lib/core/assembly/box/tick_changed
  i32.const 5
  i32.const 1184
  call $~lib/rt/__allocArray
  global.set $lib/core/assembly/box/slice_deps_stack
  i32.const 0
  global.set $lib/core/assembly/box/slice_deps
  i32.const 0
  global.set $lib/core/assembly/box/slice_current_id
  call $~lib/map/Map<i32,~lib/set/Set<i32>>#constructor
  global.set $lib/core/assembly/box/box_deps
  call $~lib/map/Map<i32,~lib/set/Set<i32>>#constructor
  global.set $lib/core/assembly/box/box_rels
  call $~lib/set/Set<i32>#constructor
  global.set $lib/core/assembly/box/box_invalid
  call $~lib/set/Set<i32>#constructor
  global.set $lib/core/assembly/box/box_expr
  global.get $lib/core/assembly/seq/seq_current
  i32.const 1
  i32.add
  global.set $lib/core/assembly/seq/seq_current
  global.get $lib/core/assembly/seq/seq_current
  global.set $lib/core/assembly/box/box_entry_id
 )
 (func $~lib/array/Array<i32>#pop (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  local.get $0
  i32.load offset=12
  local.tee $1
  i32.const 1
  i32.lt_s
  if
   i32.const 1200
   i32.const 1248
   i32.const 300
   i32.const 21
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.load offset=4
  local.get $1
  i32.const 1
  i32.sub
  local.tee $1
  i32.const 2
  i32.shl
  i32.add
  i32.load
  local.get $0
  local.get $1
  i32.store offset=12
 )
 (func $lib/core/assembly/slice/pop
  (local $0 i32)
  global.get $lib/core/assembly/seq/seq_slice_stack
  call $~lib/array/Array<i32>#pop
  global.set $lib/core/assembly/seq/seq_current
  global.get $lib/core/assembly/box/box_slice_stack
  call $~lib/array/Array<i32>#pop
  local.tee $0
  i32.load
  global.set $lib/core/assembly/box/tick_deep
  local.get $0
  i32.load offset=4
  global.set $lib/core/assembly/box/tick_changed
  local.get $0
  i32.load offset=8
  global.set $lib/core/assembly/box/slice_deps_stack
  local.get $0
  i32.load offset=12
  global.set $lib/core/assembly/box/slice_deps
  local.get $0
  i32.load offset=16
  global.set $lib/core/assembly/box/slice_current_id
  local.get $0
  i32.load offset=20
  global.set $lib/core/assembly/box/box_deps
  local.get $0
  i32.load offset=24
  global.set $lib/core/assembly/box/box_rels
  local.get $0
  i32.load offset=28
  global.set $lib/core/assembly/box/box_invalid
  local.get $0
  i32.load offset=32
  global.set $lib/core/assembly/box/box_expr
  local.get $0
  i32.load offset=36
  global.set $lib/core/assembly/box/box_entry_id
 )
 (func $~lib/rt/stub/__realloc (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  local.get $0
  i32.const 16
  i32.sub
  local.tee $3
  i32.load offset=4
  drop
  global.get $~lib/rt/stub/offset
  local.get $0
  local.get $3
  i32.load
  local.tee $4
  i32.add
  i32.eq
  local.set $5
  local.get $1
  i32.const 15
  i32.add
  i32.const -16
  i32.and
  local.set $2
  local.get $1
  local.get $4
  i32.gt_u
  if
   local.get $5
   if
    local.get $1
    i32.const 1073741808
    i32.gt_u
    if
     unreachable
    end
    local.get $0
    local.get $2
    i32.add
    local.tee $4
    memory.size
    local.tee $5
    i32.const 16
    i32.shl
    local.tee $6
    i32.gt_u
    if
     local.get $5
     local.get $4
     local.get $6
     i32.sub
     i32.const 65535
     i32.add
     i32.const -65536
     i32.and
     i32.const 16
     i32.shr_u
     local.tee $6
     local.get $5
     local.get $6
     i32.gt_s
     select
     memory.grow
     i32.const 0
     i32.lt_s
     if
      local.get $6
      memory.grow
      i32.const 0
      i32.lt_s
      if
       unreachable
      end
     end
    end
    local.get $4
    global.set $~lib/rt/stub/offset
    local.get $3
    local.get $2
    i32.store
   else
    local.get $2
    local.get $4
    i32.const 1
    i32.shl
    local.tee $4
    local.get $2
    local.get $4
    i32.gt_u
    select
    local.get $3
    i32.load offset=8
    call $~lib/rt/stub/__alloc
    local.tee $2
    local.get $0
    local.get $3
    i32.load offset=12
    call $~lib/memory/memory.copy
    local.get $2
    local.tee $0
    i32.const 16
    i32.sub
    local.set $3
   end
  else
   local.get $5
   if
    local.get $0
    local.get $2
    i32.add
    global.set $~lib/rt/stub/offset
    local.get $3
    local.get $2
    i32.store
   end
  end
  local.get $3
  local.get $1
  i32.store offset=12
  local.get $0
 )
 (func $~lib/array/ensureSize (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $1
  local.get $0
  i32.load offset=8
  local.tee $2
  i32.const 2
  i32.shr_u
  i32.gt_u
  if
   local.get $1
   i32.const 268435452
   i32.gt_u
   if
    i32.const 1072
    i32.const 1248
    i32.const 14
    i32.const 48
    call $~lib/builtins/abort
    unreachable
   end
   local.get $2
   local.get $0
   i32.load
   local.tee $4
   local.get $1
   i32.const 2
   i32.shl
   local.tee $3
   call $~lib/rt/stub/__realloc
   local.tee $1
   i32.add
   local.get $3
   local.get $2
   i32.sub
   call $~lib/memory/memory.fill
   local.get $1
   local.get $4
   i32.ne
   if
    local.get $0
    local.get $1
    i32.store
    local.get $0
    local.get $1
    i32.store offset=4
   end
   local.get $0
   local.get $3
   i32.store offset=8
  end
 )
 (func $~lib/array/Array<i32>#push (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  local.get $0
  i32.load offset=12
  local.tee $2
  i32.const 1
  i32.add
  local.tee $3
  call $~lib/array/ensureSize
  local.get $0
  i32.load offset=4
  local.get $2
  i32.const 2
  i32.shl
  i32.add
  local.get $1
  i32.store
  local.get $0
  local.get $3
  i32.store offset=12
 )
 (func $lib/core/assembly/slice/push
  (local $0 i32)
  (local $1 i32)
  global.get $lib/core/assembly/seq/seq_slice_stack
  global.get $lib/core/assembly/seq/seq_current
  call $~lib/array/Array<i32>#push
  i32.const 0
  global.set $lib/core/assembly/seq/seq_current
  global.get $lib/core/assembly/box/box_slice_stack
  i32.const 40
  i32.const 0
  call $~lib/rt/stub/__alloc
  local.tee $0
  i32.const 0
  i32.store
  local.get $0
  i32.const 0
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.store offset=8
  local.get $0
  i32.const 0
  i32.store offset=12
  local.get $0
  i32.const 0
  i32.store offset=16
  local.get $0
  i32.const 0
  i32.store offset=20
  local.get $0
  i32.const 0
  i32.store offset=24
  local.get $0
  i32.const 0
  i32.store offset=28
  local.get $0
  i32.const 0
  i32.store offset=32
  local.get $0
  i32.const 0
  i32.store offset=36
  local.get $0
  global.get $lib/core/assembly/box/tick_deep
  i32.store
  local.get $0
  global.get $lib/core/assembly/box/tick_changed
  i32.store offset=4
  local.get $0
  global.get $lib/core/assembly/box/slice_deps_stack
  i32.store offset=8
  local.get $0
  global.get $lib/core/assembly/box/slice_deps
  i32.store offset=12
  local.get $0
  global.get $lib/core/assembly/box/slice_current_id
  i32.store offset=16
  local.get $0
  global.get $lib/core/assembly/box/box_deps
  i32.store offset=20
  local.get $0
  global.get $lib/core/assembly/box/box_rels
  i32.store offset=24
  local.get $0
  global.get $lib/core/assembly/box/box_invalid
  i32.store offset=28
  local.get $0
  global.get $lib/core/assembly/box/box_expr
  i32.store offset=32
  local.get $0
  global.get $lib/core/assembly/box/box_entry_id
  i32.store offset=36
  local.get $0
  call $~lib/array/Array<i32>#push
  i32.const 0
  global.set $lib/core/assembly/box/tick_deep
  call $~lib/set/Set<i32>#constructor
  global.set $lib/core/assembly/box/tick_changed
  i32.const 5
  i32.const 1296
  call $~lib/rt/__allocArray
  global.set $lib/core/assembly/box/slice_deps_stack
  i32.const 0
  global.set $lib/core/assembly/box/slice_deps
  i32.const 0
  global.set $lib/core/assembly/box/slice_current_id
  call $~lib/map/Map<i32,~lib/set/Set<i32>>#constructor
  global.set $lib/core/assembly/box/box_deps
  call $~lib/map/Map<i32,~lib/set/Set<i32>>#constructor
  global.set $lib/core/assembly/box/box_rels
  call $~lib/set/Set<i32>#constructor
  global.set $lib/core/assembly/box/box_invalid
  call $~lib/set/Set<i32>#constructor
  global.set $lib/core/assembly/box/box_expr
  global.get $lib/core/assembly/seq/seq_current
  i32.const 1
  i32.add
  global.set $lib/core/assembly/seq/seq_current
  global.get $lib/core/assembly/seq/seq_current
  global.set $lib/core/assembly/box/box_entry_id
 )
 (func $lib/core/assembly/box/box_value_create (result i32)
  global.get $lib/core/assembly/seq/seq_current
  i32.const 1
  i32.add
  global.set $lib/core/assembly/seq/seq_current
  global.get $lib/core/assembly/seq/seq_current
 )
 (func $~lib/set/Set<i32>#find (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  local.get $0
  i32.load
  local.get $2
  local.get $0
  i32.load offset=4
  i32.and
  i32.const 2
  i32.shl
  i32.add
  i32.load
  local.set $0
  loop $while-continue|0
   local.get $0
   if
    local.get $0
    i32.load offset=4
    i32.const 1
    i32.and
    if (result i32)
     i32.const 0
    else
     local.get $1
     local.get $0
     i32.load
     i32.eq
    end
    if
     local.get $0
     return
    end
    local.get $0
    i32.load offset=4
    i32.const -2
    i32.and
    local.set $0
    br $while-continue|0
   end
  end
  i32.const 0
 )
 (func $~lib/set/Set<i32>#rehash (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  local.get $1
  i32.const 1
  i32.add
  local.tee $3
  i32.const 2
  i32.shl
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $6
  local.get $3
  i32.const 3
  i32.shl
  i32.const 3
  i32.div_s
  local.tee $7
  i32.const 3
  i32.shl
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $4
  local.get $0
  i32.load offset=8
  local.tee $5
  local.get $0
  i32.load offset=16
  i32.const 3
  i32.shl
  i32.add
  local.set $8
  local.get $4
  local.set $2
  loop $while-continue|0
   local.get $5
   local.get $8
   i32.ne
   if
    local.get $5
    local.tee $3
    i32.load offset=4
    i32.const 1
    i32.and
    i32.eqz
    if
     local.get $2
     local.get $3
     i32.load
     i32.store
     local.get $2
     local.get $6
     local.get $1
     local.get $3
     i32.load
     local.tee $3
     i32.const 255
     i32.and
     i32.const -2128831035
     i32.xor
     i32.const 16777619
     i32.mul
     local.get $3
     i32.const 8
     i32.shr_u
     i32.const 255
     i32.and
     i32.xor
     i32.const 16777619
     i32.mul
     local.get $3
     i32.const 16
     i32.shr_u
     i32.const 255
     i32.and
     i32.xor
     i32.const 16777619
     i32.mul
     local.get $3
     i32.const 24
     i32.shr_u
     i32.xor
     i32.const 16777619
     i32.mul
     i32.and
     i32.const 2
     i32.shl
     i32.add
     local.tee $3
     i32.load
     i32.store offset=4
     local.get $3
     local.get $2
     i32.store
     local.get $2
     i32.const 8
     i32.add
     local.set $2
    end
    local.get $5
    i32.const 8
    i32.add
    local.set $5
    br $while-continue|0
   end
  end
  local.get $6
  local.tee $3
  local.get $0
  i32.load
  i32.ne
  drop
  local.get $0
  local.get $3
  i32.store
  local.get $0
  local.get $1
  i32.store offset=4
  local.get $4
  local.tee $1
  local.get $0
  i32.load offset=8
  i32.ne
  drop
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $0
  local.get $7
  i32.store offset=12
  local.get $0
  local.get $0
  i32.load offset=20
  i32.store offset=16
 )
 (func $~lib/set/Set<i32>#add (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  local.get $0
  local.get $1
  local.get $1
  i32.const 255
  i32.and
  i32.const -2128831035
  i32.xor
  i32.const 16777619
  i32.mul
  local.get $1
  i32.const 8
  i32.shr_u
  i32.const 255
  i32.and
  i32.xor
  i32.const 16777619
  i32.mul
  local.get $1
  i32.const 16
  i32.shr_u
  i32.const 255
  i32.and
  i32.xor
  i32.const 16777619
  i32.mul
  local.get $1
  i32.const 24
  i32.shr_u
  i32.xor
  i32.const 16777619
  i32.mul
  local.tee $3
  call $~lib/set/Set<i32>#find
  i32.eqz
  if
   local.get $0
   i32.load offset=16
   local.get $0
   i32.load offset=12
   i32.eq
   if
    local.get $0
    local.get $0
    i32.load offset=20
    local.get $0
    i32.load offset=12
    i32.const 3
    i32.mul
    i32.const 4
    i32.div_s
    i32.lt_s
    if (result i32)
     local.get $0
     i32.load offset=4
    else
     local.get $0
     i32.load offset=4
     i32.const 1
     i32.shl
     i32.const 1
     i32.or
    end
    call $~lib/set/Set<i32>#rehash
   end
   local.get $0
   i32.load offset=8
   local.get $0
   local.get $0
   i32.load offset=16
   local.tee $4
   i32.const 1
   i32.add
   i32.store offset=16
   local.get $4
   i32.const 3
   i32.shl
   i32.add
   local.tee $2
   local.get $1
   i32.store
   local.get $0
   local.get $0
   i32.load offset=20
   i32.const 1
   i32.add
   i32.store offset=20
   local.get $2
   local.get $0
   i32.load
   local.get $3
   local.get $0
   i32.load offset=4
   i32.and
   i32.const 2
   i32.shl
   i32.add
   local.tee $0
   i32.load
   i32.store offset=4
   local.get $0
   local.get $2
   i32.store
  end
 )
 (func $lib/core/assembly/box/box_value_get_phase (param $0 i32)
  global.get $lib/core/assembly/box/slice_deps
  if
   global.get $lib/core/assembly/box/slice_deps
   local.get $0
   call $~lib/set/Set<i32>#add
  end
 )
 (func $~lib/set/Set<i32>#clear (param $0 i32)
  (local $1 i32)
  i32.const 16
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $1
  local.get $0
  i32.load
  drop
  local.get $0
  local.get $1
  i32.store
  local.get $0
  i32.const 3
  i32.store offset=4
  i32.const 32
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $1
  local.get $0
  i32.load offset=8
  drop
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $0
  i32.const 4
  i32.store offset=12
  local.get $0
  i32.const 0
  i32.store offset=16
  local.get $0
  i32.const 0
  i32.store offset=20
 )
 (func $~lib/set/Set<i32>#values (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  local.get $0
  i32.load offset=8
  local.set $7
  local.get $0
  i32.load offset=16
  local.tee $5
  local.set $2
  i32.const 16
  i32.const 3
  call $~lib/rt/stub/__alloc
  local.tee $0
  i32.const 0
  i32.store
  local.get $0
  i32.const 0
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.store offset=8
  local.get $0
  i32.const 0
  i32.store offset=12
  local.get $5
  i32.const 268435452
  i32.gt_u
  if
   i32.const 1072
   i32.const 1248
   i32.const 57
   i32.const 60
   call $~lib/builtins/abort
   unreachable
  end
  local.get $2
  i32.const 2
  i32.shl
  local.tee $3
  i32.const 0
  call $~lib/rt/stub/__alloc
  local.tee $6
  local.get $3
  call $~lib/memory/memory.fill
  local.get $0
  i32.load
  drop
  local.get $0
  local.get $6
  i32.store
  local.get $0
  local.get $6
  i32.store offset=4
  local.get $0
  local.get $3
  i32.store offset=8
  local.get $0
  local.get $2
  i32.store offset=12
  loop $for-loop|0
   local.get $4
   local.get $5
   i32.lt_s
   if
    local.get $7
    local.get $4
    i32.const 3
    i32.shl
    i32.add
    local.tee $2
    i32.load offset=4
    i32.const 1
    i32.and
    i32.eqz
    if
     local.get $2
     i32.load
     local.set $2
     local.get $1
     local.get $0
     i32.load offset=12
     i32.ge_u
     if
      local.get $1
      i32.const 0
      i32.lt_s
      if
       i32.const 1312
       i32.const 1248
       i32.const 120
       i32.const 22
       call $~lib/builtins/abort
       unreachable
      end
      local.get $0
      local.get $1
      i32.const 1
      i32.add
      local.tee $3
      call $~lib/array/ensureSize
      local.get $0
      local.get $3
      i32.store offset=12
     end
     local.get $0
     i32.load offset=4
     local.get $1
     i32.const 2
     i32.shl
     i32.add
     local.get $2
     i32.store
     local.get $1
     i32.const 1
     i32.add
     local.set $1
    end
    local.get $4
    i32.const 1
    i32.add
    local.set $4
    br $for-loop|0
   end
  end
  local.get $0
  i32.load offset=12
  drop
  local.get $0
  local.get $1
  call $~lib/array/ensureSize
  local.get $0
  local.get $1
  i32.store offset=12
  local.get $0
 )
 (func $~lib/array/Array<i32>#__get (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.load offset=12
  i32.ge_u
  if
   i32.const 1312
   i32.const 1248
   i32.const 104
   i32.const 42
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.load offset=4
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  i32.load
 )
 (func $~lib/map/Map<i32,~lib/set/Set<i32>>#find (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  local.get $0
  i32.load
  local.get $2
  local.get $0
  i32.load offset=4
  i32.and
  i32.const 2
  i32.shl
  i32.add
  i32.load
  local.set $0
  loop $while-continue|0
   local.get $0
   if
    local.get $0
    i32.load offset=8
    i32.const 1
    i32.and
    if (result i32)
     i32.const 0
    else
     local.get $1
     local.get $0
     i32.load
     i32.eq
    end
    if
     local.get $0
     return
    end
    local.get $0
    i32.load offset=8
    i32.const -2
    i32.and
    local.set $0
    br $while-continue|0
   end
  end
  i32.const 0
 )
 (func $~lib/map/Map<i32,~lib/set/Set<i32>>#has (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $1
  local.get $1
  i32.const 255
  i32.and
  i32.const -2128831035
  i32.xor
  i32.const 16777619
  i32.mul
  local.get $1
  i32.const 8
  i32.shr_u
  i32.const 255
  i32.and
  i32.xor
  i32.const 16777619
  i32.mul
  local.get $1
  i32.const 16
  i32.shr_u
  i32.const 255
  i32.and
  i32.xor
  i32.const 16777619
  i32.mul
  local.get $1
  i32.const 24
  i32.shr_u
  i32.xor
  i32.const 16777619
  i32.mul
  call $~lib/map/Map<i32,~lib/set/Set<i32>>#find
  i32.const 0
  i32.ne
 )
 (func $~lib/map/Map<i32,~lib/set/Set<i32>>#get (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $1
  local.get $1
  i32.const 255
  i32.and
  i32.const -2128831035
  i32.xor
  i32.const 16777619
  i32.mul
  local.get $1
  i32.const 8
  i32.shr_u
  i32.const 255
  i32.and
  i32.xor
  i32.const 16777619
  i32.mul
  local.get $1
  i32.const 16
  i32.shr_u
  i32.const 255
  i32.and
  i32.xor
  i32.const 16777619
  i32.mul
  local.get $1
  i32.const 24
  i32.shr_u
  i32.xor
  i32.const 16777619
  i32.mul
  call $~lib/map/Map<i32,~lib/set/Set<i32>>#find
  local.tee $0
  i32.eqz
  if
   i32.const 1376
   i32.const 1440
   i32.const 104
   i32.const 17
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.load offset=4
 )
 (func $~lib/set/Set<i32>#has (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  local.get $1
  local.get $1
  i32.const 255
  i32.and
  i32.const -2128831035
  i32.xor
  i32.const 16777619
  i32.mul
  local.get $1
  i32.const 8
  i32.shr_u
  i32.const 255
  i32.and
  i32.xor
  i32.const 16777619
  i32.mul
  local.get $1
  i32.const 16
  i32.shr_u
  i32.const 255
  i32.and
  i32.xor
  i32.const 16777619
  i32.mul
  local.get $1
  i32.const 24
  i32.shr_u
  i32.xor
  i32.const 16777619
  i32.mul
  call $~lib/set/Set<i32>#find
  i32.const 0
  i32.ne
 )
 (func $lib/core/assembly/box/tick_finish
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  global.get $lib/core/assembly/box/tick_deep
  i32.const 1
  i32.gt_s
  if (result i32)
   i32.const 1
  else
   global.get $lib/core/assembly/box/tick_changed
   i32.load offset=20
   i32.eqz
  end
  if
   global.get $lib/core/assembly/box/tick_deep
   i32.const 1
   i32.sub
   global.set $lib/core/assembly/box/tick_deep
   return
  end
  i32.const 100
  local.set $6
  loop $for-loop|0
   local.get $6
   if
    block $for-break0
     global.get $lib/core/assembly/box/tick_changed
     local.set $0
     loop $for-loop|1
      local.get $0
      call $~lib/set/Set<i32>#constructor
      local.set $0
      i32.const 0
      local.set $1
      call $~lib/set/Set<i32>#values
      local.tee $5
      i32.load offset=12
      local.set $4
      loop $for-loop|2
       local.get $1
       local.get $4
       i32.lt_s
       if
        local.get $5
        local.get $1
        call $~lib/array/Array<i32>#__get
        local.set $8
        global.get $lib/core/assembly/box/box_rels
        local.get $8
        call $~lib/map/Map<i32,~lib/set/Set<i32>>#has
        if
         i32.const 0
         local.set $7
         global.get $lib/core/assembly/box/box_rels
         local.get $8
         call $~lib/map/Map<i32,~lib/set/Set<i32>>#get
         call $~lib/set/Set<i32>#values
         local.tee $3
         i32.load offset=12
         local.set $2
         loop $for-loop|3
          local.get $7
          local.get $2
          i32.lt_s
          if
           local.get $3
           local.get $7
           call $~lib/array/Array<i32>#__get
           local.set $8
           global.get $lib/core/assembly/box/box_invalid
           local.get $8
           call $~lib/set/Set<i32>#add
           local.get $0
           local.get $8
           call $~lib/set/Set<i32>#add
           local.get $7
           i32.const 1
           i32.add
           local.set $7
           br $for-loop|3
          end
         end
        end
        local.get $1
        i32.const 1
        i32.add
        local.set $1
        br $for-loop|2
       end
      end
      local.get $0
      i32.load offset=20
      br_if $for-loop|1
     end
     global.get $lib/core/assembly/box/tick_changed
     call $~lib/set/Set<i32>#clear
     i32.const 0
     local.set $8
     global.get $lib/core/assembly/box/box_invalid
     call $~lib/set/Set<i32>#values
     local.tee $0
     i32.load offset=12
     local.set $7
     loop $for-loop|4
      local.get $8
      local.get $7
      i32.lt_s
      if
       local.get $0
       local.get $8
       call $~lib/array/Array<i32>#__get
       local.set $1
       global.get $lib/core/assembly/box/box_expr
       local.get $1
       call $~lib/set/Set<i32>#has
       if
        local.get $1
        call $lib/core/assembly/call/call
       end
       local.get $8
       i32.const 1
       i32.add
       local.set $8
       br $for-loop|4
      end
     end
     global.get $lib/core/assembly/box/tick_changed
     i32.load offset=20
     i32.eqz
     br_if $for-break0
     local.get $6
     i32.const 1
     i32.sub
     local.set $6
     br $for-loop|0
    end
   end
  end
  global.get $lib/core/assembly/box/tick_deep
  i32.const 1
  i32.sub
  global.set $lib/core/assembly/box/tick_deep
  local.get $6
  i32.eqz
  if
   i32.const 2
   call $lib/core/assembly/error/error
  end
 )
 (func $lib/core/assembly/box/box_value_set_phase (param $0 i32)
  (local $1 i32)
  global.get $lib/core/assembly/box/tick_deep
  i32.eqz
  local.tee $1
  if
   global.get $lib/core/assembly/box/tick_deep
   i32.eqz
   if
    global.get $lib/core/assembly/box/tick_changed
    call $~lib/set/Set<i32>#clear
   end
   global.get $lib/core/assembly/box/tick_deep
   i32.const 1
   i32.add
   global.set $lib/core/assembly/box/tick_deep
   global.get $lib/core/assembly/box/tick_deep
   i32.const 100
   i32.gt_s
   if
    i32.const 1
    call $lib/core/assembly/error/error
   end
  end
  global.get $lib/core/assembly/box/tick_changed
  local.get $0
  call $~lib/set/Set<i32>#add
  local.get $1
  if
   call $lib/core/assembly/box/tick_finish
  end
 )
 (func $lib/core/assembly/box/box_expr_create (result i32)
  (local $0 i32)
  global.get $lib/core/assembly/seq/seq_current
  i32.const 1
  i32.add
  global.set $lib/core/assembly/seq/seq_current
  global.get $lib/core/assembly/box/box_expr
  global.get $lib/core/assembly/seq/seq_current
  local.tee $0
  call $~lib/set/Set<i32>#add
  local.get $0
 )
 (func $lib/core/assembly/box/box_expr_start (param $0 i32)
  (local $1 i32)
  (local $2 i32)
  global.get $lib/core/assembly/box/slice_deps_stack
  i32.const 8
  i32.const 0
  call $~lib/rt/stub/__alloc
  local.tee $1
  i32.const 0
  i32.store
  local.get $1
  i32.const 0
  i32.store offset=4
  local.get $1
  global.get $lib/core/assembly/box/slice_deps
  i32.store
  local.get $1
  global.get $lib/core/assembly/box/slice_current_id
  i32.store offset=4
  local.get $1
  call $~lib/array/Array<i32>#push
  call $~lib/set/Set<i32>#constructor
  global.set $lib/core/assembly/box/slice_deps
  local.get $0
  global.set $lib/core/assembly/box/slice_current_id
  global.get $lib/core/assembly/box/tick_deep
  i32.eqz
  if
   global.get $lib/core/assembly/box/tick_changed
   call $~lib/set/Set<i32>#clear
  end
  global.get $lib/core/assembly/box/tick_deep
  i32.const 1
  i32.add
  global.set $lib/core/assembly/box/tick_deep
  global.get $lib/core/assembly/box/tick_deep
  i32.const 100
  i32.gt_s
  if
   i32.const 1
   call $lib/core/assembly/error/error
  end
 )
 (func $~lib/set/Set<i32>#delete (param $0 i32) (param $1 i32)
  (local $2 i32)
  local.get $0
  local.get $1
  local.get $1
  i32.const 255
  i32.and
  i32.const -2128831035
  i32.xor
  i32.const 16777619
  i32.mul
  local.get $1
  i32.const 8
  i32.shr_u
  i32.const 255
  i32.and
  i32.xor
  i32.const 16777619
  i32.mul
  local.get $1
  i32.const 16
  i32.shr_u
  i32.const 255
  i32.and
  i32.xor
  i32.const 16777619
  i32.mul
  local.get $1
  i32.const 24
  i32.shr_u
  i32.xor
  i32.const 16777619
  i32.mul
  call $~lib/set/Set<i32>#find
  local.tee $1
  i32.eqz
  if
   return
  end
  local.get $1
  local.get $1
  i32.load offset=4
  i32.const 1
  i32.or
  i32.store offset=4
  local.get $0
  local.get $0
  i32.load offset=20
  i32.const 1
  i32.sub
  i32.store offset=20
  local.get $0
  i32.load offset=4
  i32.const 1
  i32.shr_u
  local.tee $2
  i32.const 1
  i32.add
  i32.const 4
  local.get $0
  i32.load offset=20
  local.tee $1
  i32.const 4
  local.get $1
  i32.gt_u
  select
  i32.ge_u
  if (result i32)
   local.get $0
   i32.load offset=20
   local.get $0
   i32.load offset=12
   i32.const 3
   i32.mul
   i32.const 4
   i32.div_s
   i32.lt_s
  else
   i32.const 0
  end
  if
   local.get $0
   local.get $2
   call $~lib/set/Set<i32>#rehash
  end
 )
 (func $~lib/map/Map<i32,~lib/set/Set<i32>>#rehash (param $0 i32) (param $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  local.get $1
  i32.const 1
  i32.add
  local.tee $2
  i32.const 2
  i32.shl
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $6
  local.get $2
  i32.const 3
  i32.shl
  i32.const 3
  i32.div_s
  local.tee $7
  i32.const 12
  i32.mul
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $3
  local.get $0
  i32.load offset=8
  local.tee $5
  local.get $0
  i32.load offset=16
  i32.const 12
  i32.mul
  i32.add
  local.set $8
  local.get $3
  local.set $2
  loop $while-continue|0
   local.get $5
   local.get $8
   i32.ne
   if
    local.get $5
    local.tee $4
    i32.load offset=8
    i32.const 1
    i32.and
    i32.eqz
    if
     local.get $2
     local.get $4
     i32.load
     i32.store
     local.get $2
     local.get $4
     i32.load offset=4
     i32.store offset=4
     local.get $2
     local.get $6
     local.get $1
     local.get $4
     i32.load
     local.tee $4
     i32.const 255
     i32.and
     i32.const -2128831035
     i32.xor
     i32.const 16777619
     i32.mul
     local.get $4
     i32.const 8
     i32.shr_u
     i32.const 255
     i32.and
     i32.xor
     i32.const 16777619
     i32.mul
     local.get $4
     i32.const 16
     i32.shr_u
     i32.const 255
     i32.and
     i32.xor
     i32.const 16777619
     i32.mul
     local.get $4
     i32.const 24
     i32.shr_u
     i32.xor
     i32.const 16777619
     i32.mul
     i32.and
     i32.const 2
     i32.shl
     i32.add
     local.tee $4
     i32.load
     i32.store offset=8
     local.get $4
     local.get $2
     i32.store
     local.get $2
     i32.const 12
     i32.add
     local.set $2
    end
    local.get $5
    i32.const 12
    i32.add
    local.set $5
    br $while-continue|0
   end
  end
  local.get $6
  local.tee $2
  local.get $0
  i32.load
  i32.ne
  drop
  local.get $0
  local.get $2
  i32.store
  local.get $0
  local.get $1
  i32.store offset=4
  local.get $3
  local.tee $1
  local.get $0
  i32.load offset=8
  i32.ne
  drop
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $0
  local.get $7
  i32.store offset=12
  local.get $0
  local.get $0
  i32.load offset=20
  i32.store offset=16
 )
 (func $~lib/map/Map<i32,~lib/set/Set<i32>>#set (param $0 i32) (param $1 i32) (param $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $0
  local.get $1
  local.get $1
  i32.const 255
  i32.and
  i32.const -2128831035
  i32.xor
  i32.const 16777619
  i32.mul
  local.get $1
  i32.const 8
  i32.shr_u
  i32.const 255
  i32.and
  i32.xor
  i32.const 16777619
  i32.mul
  local.get $1
  i32.const 16
  i32.shr_u
  i32.const 255
  i32.and
  i32.xor
  i32.const 16777619
  i32.mul
  local.get $1
  i32.const 24
  i32.shr_u
  i32.xor
  i32.const 16777619
  i32.mul
  local.tee $4
  call $~lib/map/Map<i32,~lib/set/Set<i32>>#find
  local.tee $3
  if
   local.get $2
   local.get $3
   i32.load offset=4
   i32.ne
   if
    local.get $3
    local.get $2
    i32.store offset=4
   end
  else
   local.get $0
   i32.load offset=16
   local.get $0
   i32.load offset=12
   i32.eq
   if
    local.get $0
    local.get $0
    i32.load offset=20
    local.get $0
    i32.load offset=12
    i32.const 3
    i32.mul
    i32.const 4
    i32.div_s
    i32.lt_s
    if (result i32)
     local.get $0
     i32.load offset=4
    else
     local.get $0
     i32.load offset=4
     i32.const 1
     i32.shl
     i32.const 1
     i32.or
    end
    call $~lib/map/Map<i32,~lib/set/Set<i32>>#rehash
   end
   local.get $0
   i32.load offset=8
   local.get $0
   local.get $0
   i32.load offset=16
   local.tee $5
   i32.const 1
   i32.add
   i32.store offset=16
   local.get $5
   i32.const 12
   i32.mul
   i32.add
   local.tee $3
   local.get $1
   i32.store
   local.get $3
   local.get $2
   i32.store offset=4
   local.get $0
   local.get $0
   i32.load offset=20
   i32.const 1
   i32.add
   i32.store offset=20
   local.get $3
   local.get $0
   i32.load
   local.get $4
   local.get $0
   i32.load offset=4
   i32.and
   i32.const 2
   i32.shl
   i32.add
   local.tee $0
   i32.load
   i32.store offset=8
   local.get $0
   local.get $3
   i32.store
  end
 )
 (func $lib/core/assembly/box/slice_deps_close
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  global.get $lib/core/assembly/box/box_invalid
  global.get $lib/core/assembly/box/slice_current_id
  call $~lib/set/Set<i32>#delete
  global.get $lib/core/assembly/box/box_deps
  global.get $lib/core/assembly/box/slice_current_id
  global.get $lib/core/assembly/box/slice_deps
  call $~lib/map/Map<i32,~lib/set/Set<i32>>#set
  global.get $lib/core/assembly/box/slice_deps
  call $~lib/set/Set<i32>#values
  local.tee $3
  i32.load offset=12
  local.set $4
  loop $for-loop|0
   local.get $0
   local.get $4
   i32.lt_s
   if
    local.get $3
    local.get $0
    call $~lib/array/Array<i32>#__get
    local.set $1
    global.get $lib/core/assembly/box/box_rels
    local.get $1
    call $~lib/map/Map<i32,~lib/set/Set<i32>>#has
    if
     global.get $lib/core/assembly/box/box_rels
     local.get $1
     call $~lib/map/Map<i32,~lib/set/Set<i32>>#get
     local.set $2
    else
     call $~lib/set/Set<i32>#constructor
     local.set $2
     global.get $lib/core/assembly/box/box_rels
     local.get $1
     local.get $2
     call $~lib/map/Map<i32,~lib/set/Set<i32>>#set
    end
    local.get $2
    global.get $lib/core/assembly/box/slice_current_id
    call $~lib/set/Set<i32>#add
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|0
   end
  end
  global.get $lib/core/assembly/box/slice_deps_stack
  call $~lib/array/Array<i32>#pop
  local.tee $1
  i32.load
  global.set $lib/core/assembly/box/slice_deps
  local.get $1
  i32.load offset=4
  global.set $lib/core/assembly/box/slice_current_id
 )
 (func $lib/core/assembly/box/box_expr_finish
  call $lib/core/assembly/box/tick_finish
  call $lib/core/assembly/box/slice_deps_close
 )
 (func $lib/core/assembly/box/box_computed_create (result i32)
  (local $0 i32)
  global.get $lib/core/assembly/seq/seq_current
  i32.const 1
  i32.add
  global.set $lib/core/assembly/seq/seq_current
  global.get $lib/core/assembly/box/box_invalid
  global.get $lib/core/assembly/seq/seq_current
  local.tee $0
  call $~lib/set/Set<i32>#add
  local.get $0
 )
 (func $lib/core/assembly/box/box_computed_start (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  global.get $lib/core/assembly/box/slice_deps
  if
   global.get $lib/core/assembly/box/slice_deps
   local.get $0
   call $~lib/set/Set<i32>#add
  end
  global.get $lib/core/assembly/box/box_invalid
  local.get $0
  call $~lib/set/Set<i32>#has
  if
   global.get $lib/core/assembly/box/slice_deps_stack
   i32.const 8
   i32.const 0
   call $~lib/rt/stub/__alloc
   local.tee $1
   i32.const 0
   i32.store
   local.get $1
   i32.const 0
   i32.store offset=4
   local.get $1
   global.get $lib/core/assembly/box/slice_deps
   i32.store
   local.get $1
   global.get $lib/core/assembly/box/slice_current_id
   i32.store offset=4
   local.get $1
   call $~lib/array/Array<i32>#push
   call $~lib/set/Set<i32>#constructor
   global.set $lib/core/assembly/box/slice_deps
   local.get $0
   global.set $lib/core/assembly/box/slice_current_id
   i32.const 0
   return
  end
  i32.const 1
 )
 (func $lib/core/assembly/box/box_computed_finish
  call $lib/core/assembly/box/slice_deps_close
 )
 (func $lib/core/assembly/box/box_entry_start
  (local $0 i32)
  (local $1 i32)
  global.get $lib/core/assembly/box/slice_deps_stack
  i32.const 8
  i32.const 0
  call $~lib/rt/stub/__alloc
  local.tee $0
  i32.const 0
  i32.store
  local.get $0
  i32.const 0
  i32.store offset=4
  local.get $0
  global.get $lib/core/assembly/box/slice_deps
  i32.store
  local.get $0
  global.get $lib/core/assembly/box/slice_current_id
  i32.store offset=4
  local.get $0
  call $~lib/array/Array<i32>#push
  i32.const 0
  global.set $lib/core/assembly/box/slice_deps
  global.get $lib/core/assembly/box/box_entry_id
  global.set $lib/core/assembly/box/slice_current_id
  global.get $lib/core/assembly/box/tick_deep
  i32.eqz
  if
   global.get $lib/core/assembly/box/tick_changed
   call $~lib/set/Set<i32>#clear
  end
  global.get $lib/core/assembly/box/tick_deep
  i32.const 1
  i32.add
  global.set $lib/core/assembly/box/tick_deep
  global.get $lib/core/assembly/box/tick_deep
  i32.const 100
  i32.gt_s
  if
   i32.const 1
   call $lib/core/assembly/error/error
  end
 )
 (func $lib/core/assembly/box/box_entry_finish
  (local $0 i32)
  call $lib/core/assembly/box/tick_finish
  global.get $lib/core/assembly/box/slice_deps_stack
  call $~lib/array/Array<i32>#pop
  local.tee $0
  i32.load
  global.set $lib/core/assembly/box/slice_deps
  local.get $0
  i32.load offset=4
  global.set $lib/core/assembly/box/slice_current_id
 )
 (func $lib/core/assembly/box/box_view_create (result i32)
  i32.const 0
 )
 (func $lib/core/assembly/box/box_view_finish
  nop
 )
 (func $~start
  i32.const 1472
  global.set $~lib/rt/stub/offset
 )
)
