/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 * @format
 * @flow strict-local
 */
'use strict';

import {requireNativeComponent, StyleSheet} from 'react-native';
import type {WindowsNativeProps, WindowsDatePickerChangeEvent} from './types';
import * as React from 'react';

const styles = StyleSheet.create({
  rnDatePicker: {
    height: 32,
    width: 150,
  },
});

const RNDateTimePickerWindows = requireNativeComponent(
  'RNDateTimePickerWindows',
);

export default class DateTimePickerWindows extends React.Component<WindowsNativeProps> {
  constructor(props: WindowsNativeProps) {
    super(props);
  }
  render() {
    const props = {
      dayOfWeekFormat: this.props.dayOfWeekFormat,
      dateFormat: this.props.dateFormat,
      firstDayOfWeek: this.props.firstDayOfWeek,
      maxDate: this.props.maximumDate
        ? this.props.maximumDate.getTime()
        : undefined, // time in milliseconds
      minDate: this.props.minimumDate
        ? this.props.minimumDate.getTime()
        : undefined, // time in milliseconds
      onChange: this.props.onChange,
      placeholderText: this.props.placeholderText,
      selectedDate: this.props.value ? this.props.value.getTime() : undefined, // time in milliseconds
      style: [styles.rnDatePicker, this.props.style],
    };

    // The Date object returns timezone in minutes. Convert that to seconds
    // and multiply by -1 so that the offset can be added to UTC+0 time to get
    // the correct value on the native side.
    const timeZoneOffsetInSeconds =
      this.props.timeZoneOffsetInSeconds != undefined
        ? this.props.timeZoneOffsetInSeconds
        : this.props.value
        ? -1 * this.props.value.getTimezoneOffset() * 60
        : undefined;

    return (
      <RNDateTimePickerWindows
        {...props}
        onChange={this._onChange}
        timeZoneOffsetInSeconds={timeZoneOffsetInSeconds}
      />
    );
  }

  _onChange = (event: WindowsDatePickerChangeEvent) => {
    this.props.onChange &&
      this.props.onChange(event, new Date(+event.nativeEvent.newDate));
  };
}
