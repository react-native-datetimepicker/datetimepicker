/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict-local
 */

'use strict';

import {DISPLAY_CALENDAR, DISPLAY_SPINNER, DISPLAY_DEFAULT} from './constants';
const DatePickerModule = require('NativeModules').DatePickerAndroid;
// import type {Options, DatePickerOpenAction} from './DatePickerAndroidTypes';

const allowedDisplayValues = [
  DISPLAY_SPINNER,
  DISPLAY_CALENDAR,
  DISPLAY_DEFAULT,
];

/**
 * Convert a Date to a timestamp.
 */
function _toMillis(options: Options, key: string) {
  const value = options[key];

  // Is it a Date object?
  if (typeof value === 'object' && typeof value.getMonth === 'function') {
    options[key] = value.getTime();
  }
}

export default class DatePickerAndroid {
  /**
   * Opens the standard Android date picker dialog.
   *
   * The available keys for the `options` object are:
   *
   *   - `value` (`Date` object) - date to show by default
   *   - `minimumDate` (`Date` object) - minimum date that can be selected
   *   - `maximumDate` (`Date` object) - maximum date that can be selected
   *   - `mode` (`enum('calendar', 'spinner', 'default')`) - To set the date-picker mode to calendar/spinner/default
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
  static async open(options: ?Options): Promise<DatePickerOpenAction> {
    _toMillis(options, 'value');
    _toMillis(options, 'minimumDate');
    _toMillis(options, 'maximumDate');

    options.mode = allowedDisplayValues.includes(options.display)
      ? options.display
      : DISPLAY_DEFAULT;
    options.date = options.value; // CHANGE JAVA CODE

    return DatePickerModule.open(options);
  }

  /**
   * A date has been selected.
   */
  static +dateSetAction: 'dateSetAction' = 'dateSetAction';
  /**
   * The dialog has been dismissed.
   */
  static +dismissedAction: 'dismissedAction' = 'dismissedAction';
}
