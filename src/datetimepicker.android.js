import DatePickerAndroid from './datepicker';
import TimePickerAndroid from './timepicker';
import {MODE_TIME, MODE_DATE} from './constants';

const selectors = {
  [MODE_TIME]: TimePickerAndroid,
  [MODE_DATE]: DatePickerAndroid,
};

function RNDateTimePicker({ mode, value, display, onChange, is24Hour, minimumDate, maximumDate }) {
  const Selector = selectors[mode] || DatePickerAndroid;

  Selector.open({
    minimumDate,
    maximumDate,
    is24Hour,
    display,
    value,
  }).then(function resolve({ action, day, month, year, minute, hour }) {
    const date = new Date();
    const event = {
      type: 'set',
      nativeEvent: {
        timestamp: null,
      },
    };

    switch (action) {
      case 'dateSetAction':
        event.nativeEvent.timestamp = date.setFullYear(year, month, day);
        onChange(event);
        break;

      case 'timeSetAction':
        event.nativeEvent.timestamp = date.setHours(hour, minute);
        onChange(event);
        break;

      case 'dismissedAction':
      default:
        event.type = 'dismissed';
        onChange(event);
        break;
    }
  }, function reject(error) {
    // ignore or throw `activity == null` error
    throw error;
  });

  return null;
}

const styles = {};

export {
  RNDateTimePicker as default,
  styles,
};
