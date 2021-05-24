import { _signal as signal, _value as value } from '../../src';

test('should work basic operations with reset for differents', async () => {
  const s = signal(0);
  s(1);
  expect(s.val).toBe(1);
  s.reset();
  expect(s.val).toBe(0);

  const v = value(1);
  v.update(v => v + v);
  expect(v.val).toBe(2);
  v.reset();
  expect(v.val).toBe(1);
});
