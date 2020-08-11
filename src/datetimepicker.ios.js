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
import {StyleSheet} from 'react-native';
import RNDateTimePicker from './picker';
import {toMilliseconds} from './utils';
import {MODE_DATE} from './constants';
import invariant from 'invariant';
import React from 'react';

import type {
  Event,
  NativeRef,
  IOSNativeProps,
  DatePickerOptions,
} from './types';

const styles = StyleSheet.create({
  picker: {
    height: 216,
  },
});

export default class Picker extends React.Component<IOSNativeProps> {
  static defaultProps = {
    mode: MODE_DATE,
  };

  _picker: NativeRef = React.createRef();

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
    let date;

    if (timestamp) {
      date = new Date(timestamp);
    }

    onChange && onChange(event, date);
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
      textColor,
    } = this.props;

    invariant(value, 'A date or time should be specified as `value`.');

    const dates: DatePickerOptions = {value, maximumDate, minimumDate};
    toMilliseconds(dates, 'value', 'minimumDate', 'maximumDate');

    return (
      <RNDateTimePicker
        testID={testID}
        ref={this._picker}
        style={[styles.picker, style]}
        date={dates.value}
        locale={locale !== null && locale !== '' ? locale : undefined}
        maximumDate={dates.maximumDate}
        minimumDate={dates.minimumDate}
        mode={mode}
        minuteInterval={minuteInterval}
        timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
        onChange={this._onChange}
        textColor={textColor}
        onStartShouldSetResponder={() => true}
        onResponderTerminationRequest={() => false}
      />
    );
  }
}
