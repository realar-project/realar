// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`should work 1`] = `
"
  (;;# define SEQ_ID_ADR 4;;)
  (;;# import set;;)(some wat)
(;;# import set_1;;)(some set1_wat)
(;;# define U 10;;)
(;;# $u = U;;)(local.set $u (i32.const 10))
(;;# U;;)(i32.const 10)(some wat2)
  (;;# define CONST 10;;)
  (some start)
  (;;# $i = 30;;)(local.set $i (i32.const 30))
  (;;# <debug>;;)
  (some code)
  (;;# $i = 10;;)(local.set $i (i32.const 10))
  (;;# </debug>;;)
  (;;# <debug>;;)
  (;;# $i = 11;;)(local.set $i (i32.const 11))
  (;;# </debug>;;)
  (;;# $i = ($k + 11) * 2 + 1;;)(local.set $i (i32.add (i32.mul (i32.add (local.get $k) (i32.const 11)) (i32.const 2)) (i32.const 1)))
  (;;# $i = $m(1 + 2, 10);;)(local.set $i (call $m (i32.add (i32.const 1) (i32.const 2)) (i32.const 10)))
  (;;# [$i] = [10] << $a(CONST) + $m(1 + 2, 10);;)(i32.store (local.get $i) (i32.shl (i32.load (i32.const 10)) (i32.add (call $a (i32.const 10)) (call $m (i32.add (i32.const 1) (i32.const 2)) (i32.const 10)))))
  (;;# $size = [$id];;)(local.set $size (i32.load (local.get $id)))
  (some finish)
  (;;# [SEQ_ID_ADR] = 0;;)(i32.store (i32.const 4) (i32.const 0))
  (;;# $id;;)(local.get $id)"
`;
