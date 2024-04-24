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
      // $FlowFixMe[prop-missing]
      options[key] = value.getTime();
    }
  });
}

export function dateToMilliseconds(date: ?Date): ?number {
  if (!date) {
    return;
  }
  return date.getTime();
}

export function sharedPropsValidation({
  value,
  timeZoneName,
  timeZoneOffsetInMinutes,
}: {
  value: Date,
  timeZoneName?: ?string,
  timeZoneOffsetInMinutes?: ?number,
}) {
  invariant(value, 'A date or time must be specified as `value` prop');
  invariant(
    value instanceof Date,
    '`value` prop must be an instance of Date object',
  );
  invariant(
    timeZoneName == null || timeZoneOffsetInMinutes == null,
    '`timeZoneName` and `timeZoneOffsetInMinutes` cannot be specified at the same time',
  );
  if (timeZoneOffsetInMinutes !== undefined) {
    console.warn(
      '`timeZoneOffsetInMinutes` is deprecated and will be removed in a future release. Use `timeZoneName` instead.',
    );
  }
}
