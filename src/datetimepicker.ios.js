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
import {View, requireNativeComponent, StyleSheet} from 'react-native';
import invariant from 'invariant';
import React from 'react';
import type {ViewProps} from 'ViewPropTypes';
import type {SyntheticEvent} from 'CoreEventTypes';

import {MODE_DATE, MODE_DATETIME, MODE_TIME} from './constants';

const RNDateTimePicker = requireNativeComponent('RNDateTimePicker');
// Should be included again for Flow type definitions.
//const RCTDatePickerNativeComponent = require('RCTDatePickerNativeComponent');
const styles = StyleSheet.create({
  picker: {
    height: 216,
  },
});

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
  mode?: ?(MODE_DATE | MODE_TIME | MODE_DATETIME),

  /**
   * Date change handler.
   *
   * This is called when the user changes the date or time in the UI.
   * The first argument is an Event, the second a selected Date.
   */
  onChange?: ?(event: Event, date: Date) => void,

  /**
   * Timezone offset in minutes (iOS only).
   *
   * By default, the date picker will use the device's timezone. With this
   * parameter, it is possible to force a certain timezone offset. For
   * instance, to show times in Pacific Standard Time, pass -7 * 60.
   */
  timeZoneOffsetInMinutes?: ?number,
|}>;

export default class Picker extends React.Component<Props> {
  static defaultProps = {
    mode: MODE_DATE,
  };

  _picker: ?React.ElementRef<
    typeof RCTDatePickerNativeComponent,
  > = React.createRef();

  componentDidUpdate() {
    const {onChange, value} = this.props;

    if (value && onChange && this._picker.current) {
      this._picker.current.setNativeProps({
        date: value.getTime(),
      });
    }
  }

  _onChange = (event: Event) => {
    const {onChange} = this.props;
    const timestamp = event.nativeEvent.timestamp;

    onChange && onChange(event, timestamp && new Date(timestamp));
  };

  render() {
    const {
      value,
      locale,
      maximumDate,
      minimumDate,
      style,
      testID,
      mode,
      minuteInterval,
      timeZoneOffsetInMinutes,
    } = this.props;

    invariant(value, 'A date or time should be specified as `value`.');

    return (
      <View style={style}>
        <RNDateTimePicker
          testID={testID}
          ref={this._picker}
          style={styles.picker}
          date={value}
          locale={locale != null && locale !== '' ? locale : undefined}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          mode={mode}
          minuteInterval={minuteInterval}
          timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
          onChange={this._onChange}
          onStartShouldSetResponder={() => true}
          onResponderTerminationRequest={() => false}
        />
      </View>
    );
  }
}
