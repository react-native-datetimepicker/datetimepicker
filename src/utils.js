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

    // Is it a valid Date object?
    // $FlowFixMe: Cannot get `Object.prototype.toString` because property `toString` [1] cannot be unbound from the context [2] where it was defined.
    if (Object.prototype.toString.call(value) === '[object Date]') {
      options[key] = value.getTime();
    }
  });
}
