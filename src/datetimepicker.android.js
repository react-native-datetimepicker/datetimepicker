import DatePickerAndroid from './datepicker';
import TimePickerAndroid from './timepicker';
import invariant from 'invariant';
import {
  MODE_DATE,
  MODE_TIME,
  DISPLAY_DEFAULT,
  DISPLAY_CALENDAR,
  DISPLAY_CLOCK,
  DISPLAY_SPINNER,
} from './constants';

const selectors = {
  [MODE_TIME]: TimePickerAndroid,
  [MODE_DATE]: DatePickerAndroid,
};

// Should be included again for Flow type definitions.
//const RCTDatePickerNativeComponent = require('RCTDatePickerNativeComponent');
type Event = SyntheticEvent<
  $ReadOnly<{|
    timestamp: number,
  |}>,
>;

type Props = $ReadOnly<{|
  ...ViewProps,

  /**
   * The currently selected date.
   */
  value?: ?Date,

  /**
   * Display TimePicker in 24 hour.
   */
  is24Hour?: ?boolean,

  /**
   * Maximum date.
   *
   * Restricts the range of possible date/time values.
   */
  maximumDate?: ?Date,

  /**
   * Minimum date.
   *
   * Restricts the range of possible date/time values.
   */
  minimumDate?: ?Date,

  /**
   * The date picker mode.
   */
  mode?: ?(MODE_DATE | MODE_TIME),

  /**
   * The display options.
   */
  display?: ?(
    | DISPLAY_SPINNER
    | DISPLAY_DEFAULT
    | DISPLAY_CALENDAR
    | DISPLAY_CLOCK
  ),

  /**
   * Date change handler.
   *
   * This is called when the user changes the date or time in the UI.
   * The first argument is an Event, the second a selected Date.
   */
  onChange?: ?(event: Event, date: Date) => void,
|}>;

export default function RNDateTimePicker({ mode, value, display, onChange, is24Hour, minimumDate, maximumDate }) {
  const Selector = selectors[mode] || DatePickerAndroid;

  invariant(value, 'A date or time should be specified as `value`.');

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
        onChange(event, date);
        break;

      case 'timeSetAction':
        event.nativeEvent.timestamp = date.setHours(hour, minute);
        onChange(event, date);
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

RNDateTimePicker.defaultProps = {
  display: DISPLAY_DEFAULT,
  mode: MODE_DATE,
};
