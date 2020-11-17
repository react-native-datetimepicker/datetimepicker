/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict-local
 */
import {DISPLAY_DEFAULT, DATE_SET_ACTION, DISMISS_ACTION} from './constants';
import {NativeModules} from 'react-native';
import {toMilliseconds} from './utils';

import type {DatePickerOptions, DateTimePickerResult} from './types';

export default class DatePickerAndroid {
  /**
   * Opens the standard Android date picker dialog.
   *
   * The available keys for the `options` object are:
   *
   *   - `value` (`Date` object) - date to show by default
   *   - `minimumDate` (`Date` object) - minimum date that can be selected
   *   - `maximumDate` (`Date` object) - maximum date that can be selected
   *   - `display` (`enum('calendar', 'spinner', 'default')`) - To set the date-picker display to calendar/spinner/default
   *     - 'calendar': Show a date picker in calendar mode.
   *     - 'spinner': Show a date picker in spinner mode.
   *     - 'default': Show a default native date picker(spinner/calendar) based on android versions.
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
    options.display = options.display || DISPLAY_DEFAULT;

    return NativeModules.RNDatePickerAndroid.open(options);
  }

  static async dismiss(): Promise<boolean> {
    return NativeModules.RNDatePickerAndroid.dismiss();
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
