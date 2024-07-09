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
import {getOpenPicker, validateAndroidProps} from './androidUtils';
import pickers from './picker';
import {
  createDateTimeSetEvtParams,
  createDismissEvtParams,
  createNeutralEvtParams,
} from './eventCreators';
import {processColor} from 'react-native';

function open(props: AndroidNativeProps) {
  const {
    mode = ANDROID_MODE.date,
    display,
    value: originalValue,
    is24Hour,
    minimumDate,
    maximumDate,
    minuteInterval,
    timeZoneOffsetInMinutes,
    timeZoneName,
    onChange,
    onError,
    positiveButton,
    negativeButton,
    neutralButton,
    neutralButtonLabel,
    positiveButtonLabel,
    negativeButtonLabel,
    testID,
    firstDayOfWeek,
  } = props;
  validateAndroidProps(props);
  invariant(originalValue, 'A date or time must be specified as `value` prop.');

  const valueTimestamp = originalValue.getTime();
  const openPicker = getOpenPicker(mode);

  const presentPicker = async () => {
    try {
      const dialogButtons = {
        positive: {
          label: positiveButtonLabel,
          ...positiveButton,
          textColor: processColor(positiveButton?.textColor),
        },
        neutral: {
          label: neutralButtonLabel,
          ...neutralButton,
          textColor: processColor(neutralButton?.textColor),
        },
        negative: {
          label: negativeButtonLabel,
          ...negativeButton,
          textColor: processColor(negativeButton?.textColor),
        },
      };

      const displayOverride =
        display === ANDROID_DISPLAY.spinner
          ? ANDROID_DISPLAY.spinner
          : ANDROID_DISPLAY.default;
      const {action, timestamp, utcOffset} = await openPicker({
        value: valueTimestamp,
        display: displayOverride,
        is24Hour,
        minimumDate,
        maximumDate,
        minuteInterval,
        timeZoneOffsetInMinutes,
        timeZoneName,
        dialogButtons,
        testID,
        firstDayOfWeek,
      });

      switch (action) {
        case DATE_SET_ACTION:
        case TIME_SET_ACTION: {
          const date = new Date(timestamp);
          const [event] = createDateTimeSetEvtParams(date, utcOffset);
          onChange?.(event, date);
          break;
        }

        case NEUTRAL_BUTTON_ACTION: {
          const [event] = createNeutralEvtParams(originalValue, utcOffset);
          onChange?.(event, originalValue);
          break;
        }
        case DISMISS_ACTION:
        default: {
          const [event] = createDismissEvtParams(originalValue, utcOffset);
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
