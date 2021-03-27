import { isolate, effect, shared, free, un } from '../src';

test('should work basic operations with isolate', async () => {
  const destr_1 = jest.fn();
  const destr_2 = jest.fn();
  const destr_3 = jest.fn();
  const destr_4 = jest.fn();
  let unsub: any;
  let unsubs: any;
  const A = () => {
    effect(() => () => destr_1());
    const finish = isolate();
    unsub = effect(() => () => destr_2());
    effect(() => () => destr_3());
    unsubs = finish();
    un(() => destr_4());
  };

  shared(A);
  free();
  expect(destr_1).toBeCalled();
  expect(destr_4).toBeCalled();
  expect(destr_2).not.toBeCalled();

  unsub();
  expect(destr_2).toBeCalled();

  unsubs();
  expect(destr_3).toBeCalled();
});

test('should work isolate with argument', async () => {
  const destr_1 = jest.fn();
  let unsub_1: any, unsub_2: any;
  const A = () => {
    effect(() => () => destr_1());
    unsub_1 = isolate(effect(() => () => destr_1()));
    effect(() => () => destr_1());
    unsub_2 = isolate(effect(() => () => destr_1()));
  };

  shared(A);
  free();
  expect(destr_1).toBeCalledTimes(2);

  unsub_1();
  expect(destr_1).toBeCalledTimes(3);
  unsub_2();
  expect(destr_1).toBeCalledTimes(4);
});

test('should work isolate with no context', async () => {
  const destr_1 = jest.fn();
  const unsub_1 = isolate(effect(() => () => destr_1()));
  unsub_1();
  expect(destr_1).toBeCalledTimes(1);
});
