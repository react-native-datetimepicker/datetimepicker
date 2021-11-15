/**
 * @format
 * @flow strict-local
 */
import {
  DATE_SET_ACTION,
  TIME_SET_ACTION,
  DISMISS_ACTION,
  NEUTRAL_BUTTON_ACTION,
  ANDROID_DISPLAY,
  ANDROID_MODE,
  MIN_MS,
} from './constants';
import pickers from './picker';
import invariant from 'invariant';
import {useEffect} from 'react';

import type {AndroidEvent, AndroidNativeProps} from './types';

function validateProps(props: AndroidNativeProps) {
  const {mode, value, display} = props;
  invariant(value, 'A date or time should be specified as `value`.');
  invariant(
    !(display === ANDROID_DISPLAY.calendar && mode === ANDROID_MODE.time) &&
      !(display === ANDROID_DISPLAY.clock && mode === ANDROID_MODE.date),
    `display: ${display} and mode: ${mode} cannot be used together.`,
  );
}

function getPicker({
  mode,
  value,
  display,
  is24Hour,
  minimumDate,
  maximumDate,
  neutralButtonLabel,
  minuteInterval,
  timeZoneOffsetInMinutes,
}) {
  switch (mode) {
    case ANDROID_MODE.time:
      return pickers[mode].open({
        value,
        display,
        minuteInterval,
        is24Hour,
        neutralButtonLabel,
        timeZoneOffsetInMinutes,
      });
    default:
      return pickers[ANDROID_MODE.date].open({
        value,
        display,
        minimumDate,
        maximumDate,
        neutralButtonLabel,
        timeZoneOffsetInMinutes,
      });
  }
}

function timeZoneOffsetDateSetter(date, timeZoneOffsetInMinutes) {
  if (typeof timeZoneOffsetInMinutes === 'number') {
    // FIXME this causes a bug. repro: set tz offset to zero, and then keep opening and closing the calendar picker
    // https://github.com/react-native-datetimepicker/datetimepicker/issues/528
    const offset = date.getTimezoneOffset() + timeZoneOffsetInMinutes;
    const shiftedDate = new Date(date.getTime() - offset * MIN_MS);
    return shiftedDate;
  }
  return date;
}

export default function RNDateTimePicker(props: AndroidNativeProps) {
  validateProps(props);
  const {
    mode = ANDROID_MODE.date,
    display = ANDROID_DISPLAY.default,
    value,
    onChange,
    is24Hour,
    minimumDate,
    maximumDate,
    neutralButtonLabel,
    minuteInterval,
    timeZoneOffsetInMinutes,
  } = props;
  const valueTimestamp = value.getTime();

  useEffect(() => {
    // This effect runs on unmount / with mode change, and will ensure the picker is closed.
    // This allows for controlling the opening state of the picker through declarative logic in jsx.
    return () => (pickers[mode] ?? pickers[ANDROID_MODE.date]).dismiss();
  }, [mode]);

  useEffect(
    function showOrUpdatePicker() {
      const picker = getPicker({
        mode,
        value: valueTimestamp,
        display,
        is24Hour,
        minimumDate,
        maximumDate,
        neutralButtonLabel,
        minuteInterval,
        timeZoneOffsetInMinutes,
      });

      picker.then(
        function resolve({action, day, month, year, minute, hour}) {
          let date = new Date(valueTimestamp);
          const event: AndroidEvent = {
            type: 'set',
            nativeEvent: {},
          };

          switch (action) {
            case DATE_SET_ACTION:
              date.setFullYear(year, month, day);
              date = timeZoneOffsetDateSetter(date, timeZoneOffsetInMinutes);
              event.nativeEvent.timestamp = date;
              onChange(event, date);
              break;

            case TIME_SET_ACTION:
              date.setHours(hour, minute);
              date = timeZoneOffsetDateSetter(date, timeZoneOffsetInMinutes);
              event.nativeEvent.timestamp = date;
              onChange(event, date);
              break;

            case NEUTRAL_BUTTON_ACTION:
              event.type = 'neutralButtonPressed';
              onChange(event);
              break;

            case DISMISS_ACTION:
            default:
              event.type = 'dismissed';
              onChange(event);
              break;
          }
        },
        function reject(error) {
          // ignore or throw `activity == null` error
          throw error;
        },
      );
    },
    // the android dialog, when presented, will actually ignore updates to all props other than `value`
    // we need to change the behavior as described in https://github.com/react-native-datetimepicker/datetimepicker/pull/327#issuecomment-723160992
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onChange, valueTimestamp, mode],
  );

  return null;
}
