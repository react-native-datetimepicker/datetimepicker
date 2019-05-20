/**
 * @format
 * @flow strict-local
 */
import type {DatePickerOptions, TimePickerOptions} from './types';

/**
 * Convert a Date to a timestamp.
 */
export function toMilliseconds(
  options: DatePickerOptions | TimePickerOptions,
  ...keys: Array<string>
) {
  keys.forEach(function each(key) {
    const value = options[key];

    // Is it a Date object?
    if (Object.prototype.toString.call(value) === '[object Date]') {
      options[key] = value.getTime();
    }
  });
}
