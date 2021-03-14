import { stoppable } from '../src';

test('should throw exception if run stoppable outside of stoppable context', () => {
  expect(() => {
    stoppable();
  }).toThrow('Parent "pool" or "wrap" didn\'t find');
});
