import { isolate, effect, shared, free } from '../src';

test('should work basic operations with isolate', async () => {
  const destr_1 = jest.fn();
  const destr_2 = jest.fn();
  const destr_3 = jest.fn();
  let unsub: any;
  let unsubs: any;
  const A = () => {
    effect(() => () => destr_1());
    const finish = isolate();
    unsub = effect(() => () => destr_2());
    effect(() => () => destr_3());
    unsubs = finish();
  };

  shared(A);
  free();
  expect(destr_1).toBeCalled();
  expect(destr_2).not.toBeCalled();

  unsub();
  expect(destr_2).toBeCalled();

  unsubs();
  expect(destr_3).toBeCalled();
});
