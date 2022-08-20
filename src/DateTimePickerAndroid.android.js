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
} from './constants';
import invariant from 'invariant';

import type {AndroidNativeProps} from './types';
import {
  getOpenPicker,
  timeZoneOffsetDateSetter,
  validateAndroidProps,
} from './androidUtils';
import pickers from './picker';
import {
  createDateTimeSetEvtParams,
  createDismissEvtParams,
  createNeutralEvtParams,
} from './eventCreators';

function open(props: AndroidNativeProps) {
  const {
    mode = ANDROID_MODE.date,
    display = ANDROID_DISPLAY.default,
    value: originalValue,
    is24Hour,
    minimumDate,
    maximumDate,
    minuteInterval,
    timeZoneOffsetInMinutes,
    onChange,
    onError,
    neutralButtonLabel,
    positiveButtonLabel,
    negativeButtonLabel,
  } = props;
  validateAndroidProps(props);
  invariant(originalValue, 'A date or time must be specified as `value` prop.');

  const valueTimestamp = originalValue.getTime();
  const openPicker = getOpenPicker(mode);

  const presentPicker = async () => {
    try {
      const {action, day, month, year, minute, hour} = await openPicker({
        value: valueTimestamp,
        display,
        is24Hour,
        minimumDate,
        maximumDate,
        minuteInterval,
        timeZoneOffsetInMinutes,
        neutralButtonLabel,
        positiveButtonLabel,
        negativeButtonLabel,
      });

      switch (action) {
        case DATE_SET_ACTION: {
          let date = new Date(valueTimestamp);
          date.setFullYear(year, month, day);
          date = timeZoneOffsetDateSetter(date, timeZoneOffsetInMinutes);
          const [event] = createDateTimeSetEvtParams(date);
          onChange?.(event, date);
          break;
        }

        case TIME_SET_ACTION: {
          let date = new Date(valueTimestamp);
          date.setHours(hour, minute);
          date = timeZoneOffsetDateSetter(date, timeZoneOffsetInMinutes);
          const [event] = createDateTimeSetEvtParams(date);
          onChange?.(event, date);
          break;
        }

        case NEUTRAL_BUTTON_ACTION: {
          const [event] = createNeutralEvtParams(originalValue);
          onChange?.(event, originalValue);
          break;
        }
        case DISMISS_ACTION:
        default: {
          const [event] = createDismissEvtParams(originalValue);
          onChange?.(event, originalValue);
          break;
        }
      }
    } catch (error) {
      onError && onError(error);
    }
  };
  presentPicker();
}

function dismiss(mode: AndroidNativeProps['mode']): Promise<boolean> {
  // $FlowFixMe - `AbstractComponent` [1] is not an instance type.
  return pickers[mode].dismiss();
}

export const DateTimePickerAndroid = {open, dismiss};
