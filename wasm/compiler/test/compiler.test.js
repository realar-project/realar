import { preprocess } from "../preprocess";

test("should work", () => {
  const code = `
  (;;import set;;)
  (;;define CONST 10;;)
  (some start)
  (;;$i = 30;;)
(;;<debug>;;)(some code)
  (;;$i = 10;;)
(;;</debug>;;)
(;;<debug>;;)(;;$i = 11;;)(;;</debug>;;)

(;;$i = ($k + 11) * 2 + 1;;)
(;;$i = $m(1 + 2, 10);;)
(;;[$i] = [10] << $a(CONST) + $m(1 + 2, 10);;)
(;;$size = [$id];;)
(some finish)
  `;
  const out = preprocess(code, __dirname);
  expect(out).toMatchSnapshot();
});
