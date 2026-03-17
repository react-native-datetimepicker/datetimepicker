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
  validateAndroidProps,
  materialPickers,
} from './androidUtils';
import defaultPickers from './picker';
import {
  createDateTimeSetEvtParams,
  createDismissEvtParams,
  createNeutralEvtParams,
} from './eventCreators';
import {processColor} from 'react-native';
import {warnIfOnChangeIsUsed} from './utils';

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
    onValueChange,
    onDismiss,
    onNeutralButtonPress,
    onError,
    positiveButton,
    negativeButton,
    neutralButton,
    testID,
    firstDayOfWeek,
    title,
    initialInputMode,
    design,
    fullscreen,
    startOnYearSelection,
  } = props;
  validateAndroidProps(props);
  warnIfOnChangeIsUsed(onChange);
  invariant(originalValue, 'A date or time must be specified as `value` prop.');

  const valueTimestamp = originalValue.getTime();
  const openPicker = getOpenPicker(mode, design);

  const presentPicker = async () => {
    try {
      const dialogButtons = {
        positive: {
          ...positiveButton,
          textColor: processColor(positiveButton?.textColor),
        },
        neutral: {
          ...neutralButton,
          textColor: processColor(neutralButton?.textColor),
        },
        negative: {
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
        title,
        initialInputMode,
        fullscreen,
        startOnYearSelection,
      });

      switch (action) {
        case DATE_SET_ACTION:
        case TIME_SET_ACTION: {
          const date = new Date(timestamp);
          if (onValueChange) {
            onValueChange({nativeEvent: {timestamp, utcOffset}}, date);
          } else {
            const [event] = createDateTimeSetEvtParams(date, utcOffset);
            onChange?.(event, date);
          }
          break;
        }

        case NEUTRAL_BUTTON_ACTION: {
          if (onNeutralButtonPress) {
            onNeutralButtonPress();
          } else {
            const [event] = createNeutralEvtParams(originalValue, utcOffset);
            onChange?.(event, originalValue);
          }
          break;
        }
        case DISMISS_ACTION:
        default: {
          if (onDismiss) {
            onDismiss();
          } else {
            const [event] = createDismissEvtParams(originalValue, utcOffset);
            onChange?.(event, originalValue);
          }
          break;
        }
      }
    } catch (error) {
      onError && onError(error);
    }
  };
  presentPicker();
}

function dismiss(
  mode: AndroidNativeProps['mode'],
  design?: AndroidNativeProps['design'] = 'default',
): Promise<boolean> {
  const pickers = design === 'material' ? materialPickers : defaultPickers;
  // $FlowFixMe - `AbstractComponent` [1] is not an instance type.
  return pickers[mode].dismiss();
}

export const DateTimePickerAndroid = {open, dismiss};
