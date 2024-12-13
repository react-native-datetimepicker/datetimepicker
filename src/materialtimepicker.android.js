/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict-local
 */
import {TIME_SET_ACTION, DISMISS_ACTION, ANDROID_DISPLAY} from './constants';
import {toMilliseconds} from './utils';
import RNMaterialTimePickerAndroid from './specs/NativeModuleMaterialTimePicker';
import type {TimePickerOptions, DateTimePickerResult} from './types';

export default class MaterialTimePickerAndroid {
  /**
   * Opens the standard Android time picker dialog.
   *
   * The available keys for the `options` object are:
   *   - `value` (`Date` object) - date to show by default
   *   * `is24Hour` (boolean) - If `true`, the picker uses the 24-hour format. If `false`,
   *     the picker shows an AM/PM chooser. If undefined, the default for the current locale
   *     is used.
   *   * `initialInputMode` (enum('default' | 'keyboard')) - sets the input mode for the time picker.
   *      The user can still switch to the other input mode. The default is a clock.
   *   * `title` (string) - set the title of the dialog
   *
   * Returns a Promise which will be invoked an object containing `action`, `hour` (0-23),
   * `minute` (0-59) if the user picked a time. If the user dismissed the dialog, the Promise will
   * still be resolved with action being `TimePickerAndroid.dismissedAction` and all the other keys
   * being undefined. **Always** check whether the `action` before reading the values.
   */
  static async open(options: TimePickerOptions): Promise<DateTimePickerResult> {
    toMilliseconds(options, 'value');
    options.display = options.display || ANDROID_DISPLAY.default;
    return RNMaterialTimePickerAndroid.open(options);
  }

  static async dismiss(): Promise<boolean> {
    return RNMaterialTimePickerAndroid.dismiss();
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
