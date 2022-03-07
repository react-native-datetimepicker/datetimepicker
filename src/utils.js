/**
 * @format
 * @flow strict-local
 */
import type {DatePickerOptions, TimePickerOptions} from './types';
import invariant from 'invariant';

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

export function sharedPropsValidation({value}: {value: ?Date}) {
  invariant(value, 'A date or time must be specified as `value` prop');
  invariant(
    value instanceof Date,
    '`value` prop must be an instance of Date object',
  );
}
