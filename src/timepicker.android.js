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

import {DISPLAY_CLOCK, DISPLAY_SPINNER, DISPLAY_DEFAULT} from './constants';
const TimePickerModule = require('NativeModules').TimePickerAndroid;
// import type { TimePickerOptions, TimePickerResult } from './TimePickerAndroidTypes';

const allowedDisplayValues = [DISPLAY_SPINNER, DISPLAY_CLOCK, DISPLAY_DEFAULT];

/*
 * Convert a Date to a timestamp.
 */
function _toTime(options: Options) {
  const value = options.value;

  // Is it a Date object?
  if (typeof value === 'object' && typeof value.getMonth === 'function') {
    options.hour = value.getHours();
    options.minute = value.getMinutes();
    delete options.value;
  }
}

class TimePickerAndroid {
  /**
   * Opens the standard Android time picker dialog.
   *
   * The available keys for the `options` object are:
   *   * `hour` (0-23) - the hour to show, defaults to the current time
   *   * `minute` (0-59) - the minute to show, defaults to the current time
   *   * `is24Hour` (boolean) - If `true`, the picker uses the 24-hour format. If `false`,
   *     the picker shows an AM/PM chooser. If undefined, the default for the current locale
   *     is used.
   *   * `mode` (`enum('clock', 'spinner', 'default')`) - set the time picker mode
   *     - 'clock': Show a time picker in clock mode.
   *     - 'spinner': Show a time picker in spinner mode.
   *     - 'default': Show a default time picker based on Android versions.
   *
   * Returns a Promise which will be invoked an object containing `action`, `hour` (0-23),
   * `minute` (0-59) if the user picked a time. If the user dismissed the dialog, the Promise will
   * still be resolved with action being `TimePickerAndroid.dismissedAction` and all the other keys
   * being undefined. **Always** check whether the `action` before reading the values.
   */
  static async open(options: TimePickerOptions): Promise<TimePickerResult> {
    _toTime(options);

    options.mode = allowedDisplayValues.includes(options.display)
      ? options.display
      : DISPLAY_DEFAULT;

    return TimePickerModule.open(options);
  }

  /**
   * A time has been selected.
   */
  static +timeSetAction: 'timeSetAction' = 'timeSetAction';
  /**
   * The dialog has been dismissed.
   */
  static +dismissedAction: 'dismissedAction' = 'dismissedAction';
}

module.exports = TimePickerAndroid;
