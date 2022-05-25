/**
 * @format
 * @flow strict-local
 */
import DatePickerAndroid from './datepicker.android';
import TimePickerAndroid from './timepicker.android';
import {ANDROID_MODE} from './constants';

const pickers = {
  [ANDROID_MODE.date]: DatePickerAndroid,
  [ANDROID_MODE.time]: TimePickerAndroid,
};

export default pickers;
