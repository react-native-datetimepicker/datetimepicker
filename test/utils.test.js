import {toMilliseconds} from '../src/utils.js';

describe('utils', () => {
  describe('toMilliseconds', () => {
    it('converts Date values by key to milliseconds', () => {
      const options = {
        value: new Date('2020-12-12'),
        minimumDate: new Date('1950-01-01'),
        maximumDate: new Date('2050-12-31'),
      };

      toMilliseconds(options, 'value');
      expect(options).toHaveProperty('value', 1607731200000);

      toMilliseconds(options, 'minimumDate', 'maximumDate');
      expect(options).toHaveProperty('minimumDate', -631152000000);
      expect(options).toHaveProperty('maximumDate', 2556057600000);
    });
  });
});
