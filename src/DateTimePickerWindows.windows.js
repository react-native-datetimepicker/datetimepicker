/**
 * @format
 * @flow strict-local
 */
import {
  DATE_SET_ACTION,
  TIME_SET_ACTION,
  DISMISS_ACTION,
  WINDOWS_MODE,
} from './constants';
import invariant from 'invariant';

import type {WindowsNativeProps} from './types';
import NativeModuleDatePickerWindows from './specs/NativeModuleDatePickerWindows';
import NativeModuleTimePickerWindows from './specs/NativeModuleTimePickerWindows';
import {
  createDateTimeSetEvtParams,
  createDismissEvtParams,
} from './eventCreators';

function open(props: WindowsNativeProps) {
  const {
    mode = WINDOWS_MODE.date,
    value: originalValue,
    is24Hour,
    minimumDate,
    maximumDate,
    minuteInterval,
    timeZoneOffsetInSeconds,
    onChange,
    onError,
    testID,
    firstDayOfWeek,
    dayOfWeekFormat,
    dateFormat,
    placeholderText,
  } = props;

  invariant(originalValue, 'A date or time must be specified as `value` prop.');

  const valueTimestamp = originalValue.getTime();
  
  const presentPicker = async () => {
    try {
      let result;
      
      if (mode === WINDOWS_MODE.date) {
        // Use DatePicker TurboModule
        invariant(
          NativeModuleDatePickerWindows,
          'NativeModuleDatePickerWindows is not available'
        );
        
        result = await NativeModuleDatePickerWindows.open({
          maximumDate: maximumDate ? maximumDate.getTime() : undefined,
          minimumDate: minimumDate ? minimumDate.getTime() : undefined,
          timeZoneOffsetInSeconds,
          dayOfWeekFormat,
          dateFormat,
          firstDayOfWeek,
          placeholderText,
          testID,
        });
      } else if (mode === WINDOWS_MODE.time) {
        // Use TimePicker TurboModule
        invariant(
          NativeModuleTimePickerWindows,
          'NativeModuleTimePickerWindows is not available'
        );
        
        result = await NativeModuleTimePickerWindows.open({
          selectedTime: valueTimestamp,
          is24Hour,
          minuteInterval,
          testID,
        });
      } else {
        throw new Error(`Unsupported mode: ${mode}`);
      }

      const {action} = result;

      if (action === DATE_SET_ACTION || action === TIME_SET_ACTION || action === 'dateSetAction' || action === 'timeSetAction') {
        const event = createDateTimeSetEvtParams(
          mode === WINDOWS_MODE.date ? result.timestamp : (result.hour * 3600 + result.minute * 60) * 1000,
          result.utcOffset || 0
        );
        onChange && onChange(event, new Date(event.nativeEvent.timestamp));
      } else if (action === DISMISS_ACTION || action === 'dismissedAction') {
        const event = createDismissEvtParams();
        onChange && onChange(event);
      }
      
      return result;
    } catch (error) {
      onError && onError(error);
      throw error;
    }
  };

  return presentPicker();
}

async function dismiss() {
  // Try to dismiss both pickers since we don't know which one is open
  try {
    if (NativeModuleDatePickerWindows) {
      await NativeModuleDatePickerWindows.dismiss();
    }
  } catch (e) {
    // Ignore if not open
  }
  
  try {
    if (NativeModuleTimePickerWindows) {
      await NativeModuleTimePickerWindows.dismiss();
    }
  } catch (e) {
    // Ignore if not open
  }
}

export const DateTimePickerWindows = {
  open,
  dismiss,
};
