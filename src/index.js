/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * This is a controlled component version of RNDateTimePicker
 *
 * @format
 * @flow strict-local
 */
import DateTimePicker, {styles} from './datetimepicker';
import invariant from 'invariant';
import {View} from 'react-native';
import React from 'react';

import type {ViewProps} from 'ViewPropTypes';
import type {SyntheticEvent} from 'CoreEventTypes';

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
   * The date picker locale.
   */
  locale?: ?string,

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
   * The interval at which minutes can be selected.
   */
  minuteInterval?: ?(1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30),

  /**
   * The date picker mode.
   */
  mode?: ?('date' | 'time' | 'datetime'),

  /**
   * Date change handler.
   *
   * This is called when the user changes the date or time in the UI.
   * The first and only argument is an Event. For getting the date the picker
   * was changed to, use onDateChange instead.
   */
  onChange?: ?(event: Event) => void,

  /**
   * Date change handler.
   *
   * This is called when the user changes the date or time in the UI.
   * The first and only argument is a Date object representing the new
   * date and time.
   */
  onDateChange: (date: Date) => void,

  /**
   * Timezone offset in minutes.
   *
   * By default, the date picker will use the device's timezone. With this
   * parameter, it is possible to force a certain timezone offset. For
   * instance, to show times in Pacific Standard Time, pass -7 * 60.
   */
  timeZoneOffsetInMinutes?: ?number,
|}>;

export default class DatePicker extends React.Component<Props> {
  static defaultProps = {
    mode: 'date',
  };

  _picker: ?React.ElementRef<
    typeof RCTDatePickerNativeComponent,
  > = React.createRef();

  componentDidUpdate() {
    const {onDateChange, value} = this.props;

    if (onDateChange && this._picker.current) {
      this._picker.current.setNativeProps({
        date: value.getTime(),
      });
    }
  }

  _onChange = (event: Event) => {
    const {onDateChange, onChange} = this.props;

    onDateChange && onDateChange(new Date(event.nativeEvent.timestamp));
    onChange && onChange(event);
  };

  render() {
    const {value, locale, maximumDate, minimumDate, ...props} = this.props;
    invariant(value, 'A selected date should be specified as `value`.');

    return (
      <View style={props.style}>
        <DateTimePicker
          testID={props.testID}
          ref={this._picker}
          style={styles.picker}
          date={value && value.getTime()}
          locale={locale != null && locale !== '' ? locale : undefined}
          maximumDate={maximumDate && maximumDate.getTime()}
          minimumDate={minimumDate && minimumDate.getTime()}
          mode={props.mode}
          minuteInterval={props.minuteInterval}
          timeZoneOffsetInMinutes={props.timeZoneOffsetInMinutes}
          onChange={this._onChange}
          onStartShouldSetResponder={() => true}
          onResponderTerminationRequest={() => false}
        />
      </View>
    );
  }
}
