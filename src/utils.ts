import type {DatePickerOptions, TimePickerOptions} from './types';
import invariant from 'invariant';

/**
 * Convert a Date to a timestamp.
 */
export function toMilliseconds<T extends DatePickerOptions | TimePickerOptions>(
  options: T,
  ...keys: Array<keyof T>
) {
  keys.forEach(function each(key) {
    const value = options[key];

    // Is it a valid Date object?
    if (Object.prototype.toString.call(value) === '[object Date]') {
      // FIXME: Property 'getTime' does not exist on type 'T[keyof T]'.
      options[key] = value.getTime();
    }
  });
}

export function dateToMilliseconds(date?: Date): number | undefined {
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
  value: Date;
  timeZoneName?: string;
  timeZoneOffsetInMinutes?: number;
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
