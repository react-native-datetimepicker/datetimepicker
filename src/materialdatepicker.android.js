/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict-local
 */
import {DATE_SET_ACTION, DISMISS_ACTION, ANDROID_DISPLAY} from './constants';
import {toMilliseconds} from './utils';
import RNMaterialDatePickerAndroid from './specs/NativeModuleMaterialDatePicker';
import type {DatePickerOptions, DateTimePickerResult} from './types';

export default class MaterialDatePickerAndroid {
  /**
   * Opens the standard Android date picker dialog.
   *
   * The available keys for the `options` object are:
   *
   *   - `value` (`Date` object) - date to show by default
   *   - `minimumDate` (`Date` object) - minimum date that can be selected
   *   - `maximumDate` (`Date` object) - maximum date that can be selected
   *   * `initialInputMode` (enum('default' | 'keyboard')) - sets the input mode for the date picker.
   *      The user can still switch to the other input mode. The default is a calendar.
   *      All options are not available for the Material picker.
   *   * `title` (string) - set the title of the dialog
   *   * `fullscreen` (boolean) - set if the dialog is fullscreen
   *   * `firstDayOfWeek` (int) - set what the calendar shows as the first day of the week
   *
   * Returns a Promise which will be invoked an object containing `action`, `year`, `month` (0-11),
   * `day` if the user picked a date. If the user dismissed the dialog, the Promise will
   * still be resolved with action being `DatePickerAndroid.dismissedAction` and all the other keys
   * being undefined. **Always** check whether the `action` before reading the values.
   *
   * Note the native date picker dialog has some UI glitches on Android 4 and lower
   * when using the `minimumDate` and `maximumDate` options.
   */
  static async open(options: DatePickerOptions): Promise<DateTimePickerResult> {
    toMilliseconds(options, 'value', 'minimumDate', 'maximumDate');

    return RNMaterialDatePickerAndroid.open(options);
  }

  static async dismiss(): Promise<boolean> {
    return RNMaterialDatePickerAndroid.dismiss();
  }

  /**
   * A date has been selected.
   */
  static +dateSetAction: 'dateSetAction' = DATE_SET_ACTION;
  /**
   * The dialog has been dismissed.
   */
  static +dismissedAction: 'dismissedAction' = DISMISS_ACTION;
}
