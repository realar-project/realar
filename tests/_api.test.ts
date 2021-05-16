import { _value } from '../src';

test('should work _value with call, get, set, update, sync', () => {
  const spy = jest.fn();
  let t, r, k;
  const v = _value(0);
  const get = v.get;

  expect(get()).toBe(0);
  t = v.sync; k = t(spy);

  expect(spy).toHaveBeenCalledWith(0, void 0);
  spy.mockReset();

  t = k.update; r = t(v => v + 1);
  expect(get()).toBe(1);
  expect(spy).toHaveBeenCalledWith(1, 0);
  spy.mockReset();
  expect(r).toBeUndefined();

  t = v.set; t(10);
  expect(get()).toBe(10);
  expect(spy).toHaveBeenCalledWith(10, 1);
  spy.mockReset();

  r = v(11);
  expect(r).toBeUndefined();
  expect(get()).toBe(11);
  expect(spy).toHaveBeenNthCalledWith(1, 11, 10);
  v.call(null, 12);
  expect(get()).toBe(12);
  expect(spy).toHaveBeenNthCalledWith(2, 12, 11);
  v.apply(null, [7]);
  expect(get()).toBe(7);
  expect(spy).toHaveBeenNthCalledWith(3, 7, 12);
  spy.mockReset();
});

test('should work _value with reset', () => {
  const spy_value = jest.fn();
  const spy_reset = jest.fn();
  const v = _value(0);

  v.sync(spy_value);
  v.reset.sync(spy_reset);

  expect(spy_value).toHaveBeenCalledWith(0, void 0); spy_value.mockReset();
  expect(spy_reset).toHaveBeenCalled(); spy_reset.mockReset();

  v.reset();
  v.reset.set();
  v.reset.update();
  expect(v.reset.get()).toBeUndefined();
  expect(spy_reset).toBeCalledTimes(0);

  v(5);
  expect(spy_value).toHaveBeenCalledWith(5, 0); spy_value.mockReset();
  expect(v.reset.get()).toBeUndefined();
  v(0);
  v.reset();
  expect(spy_reset).toBeCalledTimes(0);
  v(10);
  spy_value.mockReset();

  v.reset();
  expect(spy_value).toHaveBeenCalledWith(0, 10); spy_value.mockReset();
  expect(spy_reset).toHaveBeenCalledTimes(1);
  v.reset.set();
  v.reset.update();
  expect(spy_reset).toHaveBeenCalledTimes(1); spy_reset.mockReset();

  v(5);
  v.reset.set();
  expect(spy_reset).toHaveBeenCalledTimes(1); spy_reset.mockReset();
  v(5);
  v.reset.update();
  expect(spy_reset).toHaveBeenCalledTimes(1); spy_reset.mockReset();
});


test('should work _value with dirty', () => {
  const spy = jest.fn();
  const v = _value(0);
  const dirty = v.dirty;

  expect(typeof dirty).toBe('object');
  expect(dirty.update).toBeUndefined();
  expect(dirty.set).toBeUndefined();
  expect(dirty.dirty).toBeUndefined();
  expect(dirty.get).not.toBeUndefined();

  const dirty_sync = dirty.sync;
  dirty_sync(spy);

  expect(spy).toHaveBeenCalledWith(false, void 0); spy.mockReset();
  v(5);
  v(6);
  v(5);
  expect(spy).toHaveBeenCalledWith(true, false);
  expect(spy).toHaveBeenCalledTimes(1); spy.mockReset();
  v(0);
  expect(spy).toHaveBeenCalledWith(false, true); spy.mockReset();
  v(10);
  expect(spy).toHaveBeenCalledWith(true, false); spy.mockReset();
  v.reset();
  expect(spy).toHaveBeenCalledWith(false, true); spy.mockReset();
  v(0);
  v.reset();
  expect(spy).toHaveBeenCalledTimes(0);
});

test('should work _value with update.by', () => {
  const v = _value(1);
  const k = _value(0);
  const m = _value(0);
  const p = _value(0);

  v
    .update.by(k, (_v, _k, _k_prev) => _v * 100 + _k * 10 + _k_prev)
    .update.by(() => m.get() + 1, (_v, _m, _m_prev) => _v * 1000 + _m * 10 + _m_prev)
    .update.by(p);
  expect(v.get()).toBe(1);
  k(1);
  expect(v.get()).toBe(110);
  k(2);
  expect(v.get()).toBe(11021);
  m(5);
  expect(v.get()).toBe(11021061);
  p(10);
  expect(v.get()).toBe(10);
});

test('should work _value with val', () => {
  const v = _value(1);
  expect(v.val).toBe(1);
  v.val += 1;
  expect(v.val).toBe(2);
  expect(v.dirty.val).toBe(true);
  expect(v.reset.val).toBeUndefined();

  expect(() => {
    v.dirty.val = true;
  }).toThrow('Cannot set property val of [object Object] which has only a getter');

  v.reset.val = 'anything';
  expect(v.val).toBe(1);
  expect(v.dirty.val).toBe(false);
});














