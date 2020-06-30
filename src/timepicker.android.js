/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict-local
 */
import {DISPLAY_DEFAULT, TIME_SET_ACTION, DISMISS_ACTION} from './constants';
import {NativeModules} from 'react-native';
import {toMilliseconds} from './utils';

import type {TimePickerOptions, DateTimePickerResult} from './types';

export default class TimePickerAndroid {
  /**
   * Opens the standard Android time picker dialog.
   *
   * The available keys for the `options` object are:
   *   - `value` (`Date` object) - date to show by default
   *   * `is24Hour` (boolean) - If `true`, the picker uses the 24-hour format. If `false`,
   *     the picker shows an AM/PM chooser. If undefined, the default for the current locale
   *     is used.
   *   * `minuteInterval` (enum(1 | 5 | 10 | 15 | 20 | 30)`) - set the time picker minutes' interval
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
  static async open(options: TimePickerOptions): Promise<DateTimePickerResult> {
    toMilliseconds(options, 'value');
    options.display = options.display || DISPLAY_DEFAULT;

    return NativeModules.RNTimePickerAndroid.open(options);
  }

  /**
   * A time has been selected.
   */
  static +timeSetAction: 'timeSetAction' = TIME_SET_ACTION;
  /**
   * The dialog has been dismissed.
   */
  static +dismissedAction: 'dismissedAction' = DISMISS_ACTION;
}
