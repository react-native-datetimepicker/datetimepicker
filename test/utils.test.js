import {toMilliseconds, sharedPropsValidation} from '../src/utils.js';

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

  describe('sharedPropsValidation', () => {
    describe('minimumDate and maximumDate validation', () => {
      it('should not throw when dates are in correct order', () => {
        const value = new Date('2023-06-15');
        const minimumDate = new Date('2023-01-01');
        const maximumDate = new Date('2023-12-31');

        expect(() => {
          sharedPropsValidation({value, minimumDate, maximumDate});
        }).not.toThrow();
      });

      it('should not throw when dates are equal', () => {
        const value = new Date('2023-06-15');
        const minimumDate = new Date('2023-06-15');
        const maximumDate = new Date('2023-06-15');

        expect(() => {
          sharedPropsValidation({value, minimumDate, maximumDate});
        }).not.toThrow();
      });

      it('should not throw when only minimumDate is provided', () => {
        const value = new Date('2023-06-15');
        const minimumDate = new Date('2023-01-01');

        expect(() => {
          sharedPropsValidation({value, minimumDate});
        }).not.toThrow();
      });

      it('should not throw when only maximumDate is provided', () => {
        const value = new Date('2023-06-15');
        const maximumDate = new Date('2023-12-31');

        expect(() => {
          sharedPropsValidation({value, maximumDate});
        }).not.toThrow();
      });

      it('should not throw when neither minimumDate nor maximumDate is provided', () => {
        const value = new Date('2023-06-15');

        expect(() => {
          sharedPropsValidation({value});
        }).not.toThrow();
      });

      it('should throw when minimumDate is after maximumDate', () => {
        const value = new Date('2023-06-15');
        const minimumDate = new Date('2023-12-31');
        const maximumDate = new Date('2023-01-01');

        expect(() => {
          sharedPropsValidation({value, minimumDate, maximumDate});
        }).toThrow('DateTimePicker: minimumDate (2023-12-31T00:00:00.000Z) is after maximumDate (2023-01-01T00:00:00.000Z). Please ensure minimumDate <= maximumDate.');
      });
    });
  });
});
