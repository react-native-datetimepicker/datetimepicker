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
  ANDROID_EVT_TYPE,
  EVENT_TYPE_SET,
} from './constants';
import invariant from 'invariant';

import type {DateTimePickerEvent, AndroidNativeProps} from './types';
import {
  getOpenPicker,
  timeZoneOffsetDateSetter,
  validateAndroidProps,
} from './androidUtils';
import pickers from './picker.android';

function open(props: AndroidNativeProps) {
  const {
    mode = ANDROID_MODE.date,
    display = ANDROID_DISPLAY.default,
    value: originalValue,
    is24Hour,
    minimumDate,
    maximumDate,
    neutralButtonLabel,
    minuteInterval,
    timeZoneOffsetInMinutes,
    onChange,
    onError,
  } = props;
  validateAndroidProps(props);
  invariant(originalValue, 'A date or time must be specified as `value` prop.');

  const valueTimestamp = originalValue.getTime();
  const openPicker = getOpenPicker({
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

  const presentPicker = async () => {
    try {
      const {action, day, month, year, minute, hour} = await openPicker();
      let date = new Date(valueTimestamp);
      let event: DateTimePickerEvent = {
        type: EVENT_TYPE_SET,
        nativeEvent: {},
      };

      switch (action) {
        case DATE_SET_ACTION:
          date.setFullYear(year, month, day);
          date = timeZoneOffsetDateSetter(date, timeZoneOffsetInMinutes);
          event.nativeEvent.timestamp = date.getTime();
          onChange?.(event, date);
          break;

        case TIME_SET_ACTION:
          date.setHours(hour, minute);
          date = timeZoneOffsetDateSetter(date, timeZoneOffsetInMinutes);
          event.nativeEvent.timestamp = date.getTime();
          onChange?.(event, date);
          break;

        case NEUTRAL_BUTTON_ACTION:
          event.type = ANDROID_EVT_TYPE.neutralButtonPressed;
          onChange?.(event, originalValue);
          break;

        case DISMISS_ACTION:
        default:
          event.type = ANDROID_EVT_TYPE.dismissed;
          onChange?.(event, originalValue);
          break;
      }
    } catch (error) {
      onError && onError(error);
    }
  };
  presentPicker();
}

function dismiss(mode: AndroidNativeProps['mode']) {
  // $FlowFixMe - `AbstractComponent` [1] is not an instance type.
  pickers[mode].dismiss();
}

export const DateTimePickerAndroid = {open, dismiss};
