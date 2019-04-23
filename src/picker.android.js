/**
 * @format
 * @flow strict-local
 */
import DatePickerAndroid from './datepicker';
import TimePickerAndroid from './timepicker';
import {MODE_DATE, MODE_TIME} from './constants';

const pickers = {
  [MODE_DATE]: DatePickerAndroid,
  [MODE_TIME]: TimePickerAndroid,
};

export default pickers;
