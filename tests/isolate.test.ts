import { isolate, effect, shared, free } from '../src';

test('should work basic operations with isolate', async () => {
  const destr_1 = jest.fn();
  const destr_2 = jest.fn();
  let unsub: any;
  const A = () => {
    effect(() => () => destr_1());
    const finish = isolate();
    unsub = effect(() => () => destr_2());
    finish();
  }

  shared(A);
  free();
  expect(destr_1).toBeCalled();
  expect(destr_2).not.toBeCalled();

  unsub();
  expect(destr_2).toBeCalled();
});
