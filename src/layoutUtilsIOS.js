import {NativeModules, StyleSheet} from 'react-native';
import {IOS_DISPLAY, IOS_MODE} from './constants';
import type {IOSDisplay, IOSMode} from './types';

const inlineHeightForDatePicker = 318.5;
const inlineHeightForTimePicker = 49.5;
const compactHeight = 34.5;

// NOTE these styles are only supported from ios 14
// the numbers may not be 100% accurate but were measured by calling `layoutIfNeeded`
// while the proper mode and preferredDatePickerStyle were set in the native module
const styles = StyleSheet.create({
  [`${IOS_DISPLAY.inline}_${IOS_MODE.date}`]: {
    height: inlineHeightForDatePicker + inlineHeightForTimePicker,
  },
  [`${IOS_DISPLAY.inline}_${IOS_MODE.time}`]: {
    height: inlineHeightForTimePicker,
  },
  [`${IOS_DISPLAY.inline}_${IOS_MODE.datetime}`]: {
    height: inlineHeightForDatePicker + inlineHeightForTimePicker * 2,
  },
  compact: {
    height: compactHeight,
  },
  default: {
    // this is for spinner style (UIDatePickerStyleWheels) or countdown mode
    height: 216,
  },
});

function getHeightStyleFromKnowValues(display, mode) {
  if (display === IOS_DISPLAY.compact) {
    return styles.compact;
  }
  const key = `${display}_${mode}`;
  const maybeKnownStyle = styles[key];
  return maybeKnownStyle || styles.default;
}

export function getPickerHeightStyle(
  display: IOSDisplay,
  mode: IOSMode,
): {|height: number|} | Promise<{|height: number|}> {
  if (display === IOS_DISPLAY.default && mode !== IOS_MODE.countdown) {
    // when display is UIDatePickerStyleAutomatic, ios will "Automatically pick the best style available for the current platform & mode."
    // because we don't know what that is going to be, we need to ask native for it
    // TODO vonovak this value could be cached
    return NativeModules.RNDateTimePickerManager.getDefaultDisplayValue({
      mode,
    }).then(({determinedDisplayValue}) => {
      return getHeightStyleFromKnowValues(determinedDisplayValue, mode);
    });
  }
  return getHeightStyleFromKnowValues(display, mode);
}
