// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`should work 1`] = `
"
  (some wat)
(some set1_wat)(some wat2)
  
  (some start)
  (;;$i = 30;;)(local.set $i (i32.const 30))
(some code)
  (;;$i = 10;;)(local.set $i (i32.const 10))

(;;$i = 11;;)(local.set $i (i32.const 11))

(;;$i = ($k + 11) * 2 + 1;;)(local.set $i (i32.add (i32.mul (i32.add (local.get $k) (i32.const 11)) (i32.const 2)) (i32.const 1)))
(;;$i = $m(1 + 2, 10);;)(local.set $i (call $m (i32.add (i32.const 1) (i32.const 2)) (i32.const 10)))
(;;[$i] = [10] << $a(CONST) + $m(1 + 2, 10);;)(i32.store (local.get $i) (i32.shl (i32.load (i32.const 10)) (i32.add (call $a (i32.const 10)) (call $m (i32.add (i32.const 1) (i32.const 2)) (i32.const 10)))))
(;;$size = [$id];;)(local.set $size (i32.load (local.get $id)))(some finish)"
`;
