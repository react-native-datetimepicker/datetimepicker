/**
 * @format
 * @flow strict-local
 */
import {ANDROID_DISPLAY, ANDROID_MODE, MIN_MS} from './constants';
import pickers from './picker';
import type {AndroidNativeProps, DateTimePickerResult} from './types';
import {sharedPropsValidation} from './utils';
import invariant from 'invariant';

type Timestamp = number;

type Params = {
  value: Timestamp,
  display: AndroidNativeProps['display'],
  is24Hour: AndroidNativeProps['is24Hour'],
  minimumDate: AndroidNativeProps['minimumDate'],
  maximumDate: AndroidNativeProps['maximumDate'],
  neutralButtonLabel: AndroidNativeProps['neutralButtonLabel'],
  minuteInterval: AndroidNativeProps['minuteInterval'],
  timeZoneOffsetInMinutes: AndroidNativeProps['timeZoneOffsetInMinutes'],
  positiveButtonLabel: AndroidNativeProps['positiveButtonLabel'],
  negativeButtonLabel: AndroidNativeProps['negativeButtonLabel'],
};

export type PresentPickerCallback = (Params) => Promise<DateTimePickerResult>;

function getOpenPicker(
  mode: AndroidNativeProps['mode'],
): PresentPickerCallback {
  switch (mode) {
    case ANDROID_MODE.time:
      return ({
        value,
        display,
        is24Hour,
        minuteInterval,
        timeZoneOffsetInMinutes,
        neutralButtonLabel,
        positiveButtonLabel,
        negativeButtonLabel,
      }: Params) =>
        // $FlowFixMe - `AbstractComponent` [1] is not an instance type.
        pickers[mode].open({
          value,
          display,
          minuteInterval,
          is24Hour,
          timeZoneOffsetInMinutes,
          neutralButtonLabel,
          positiveButtonLabel,
          negativeButtonLabel,
        });
    default:
      return ({
        value,
        display,
        minimumDate,
        maximumDate,
        timeZoneOffsetInMinutes,
        neutralButtonLabel,
        positiveButtonLabel,
        negativeButtonLabel,
      }: Params) =>
        // $FlowFixMe - `AbstractComponent` [1] is not an instance type.
        pickers[ANDROID_MODE.date].open({
          value,
          display,
          minimumDate,
          maximumDate,
          neutralButtonLabel,
          timeZoneOffsetInMinutes,
          positiveButtonLabel,
          negativeButtonLabel,
        });
  }
}

function timeZoneOffsetDateSetter(
  date: Date,
  timeZoneOffsetInMinutes: ?number,
): Date {
  if (typeof timeZoneOffsetInMinutes === 'number') {
    // FIXME this causes a bug. repro: set tz offset to zero, and then keep opening and closing the calendar picker
    // https://github.com/react-native-datetimepicker/datetimepicker/issues/528
    const offset = date.getTimezoneOffset() + timeZoneOffsetInMinutes;
    const shiftedDate = new Date(date.getTime() - offset * MIN_MS);
    return shiftedDate;
  }
  return date;
}

function validateAndroidProps(props: AndroidNativeProps) {
  sharedPropsValidation({value: props?.value});
  const {mode, display} = props;
  invariant(
    !(display === ANDROID_DISPLAY.calendar && mode === ANDROID_MODE.time) &&
      !(display === ANDROID_DISPLAY.clock && mode === ANDROID_MODE.date),
    `display: ${display} and mode: ${mode} cannot be used together.`,
  );
}
export {getOpenPicker, timeZoneOffsetDateSetter, validateAndroidProps};
