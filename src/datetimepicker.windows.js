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
const RNTimePickerWindows = requireNativeComponent('RNTimePickerWindows');

export default function RNDateTimePickerQWE(props: WindowsNativeProps) {
  const localProps = {
    dayOfWeekFormat: props.dayOfWeekFormat,
    dateFormat: props.dateFormat,
    firstDayOfWeek: props.firstDayOfWeek,
    maxDate: props.maximumDate ? props.maximumDate.getTime() : undefined, // time in milliseconds
    minDate: props.minimumDate ? props.minimumDate.getTime() : undefined, // time in milliseconds
    onChange: props.onChange,
    placeholderText: props.placeholderText,
    selectedDate: props.value ? props.value.getTime() : undefined, // time in milliseconds
    style: [styles.rnDatePicker, props.style],
  };

  const _onChange = (event: WindowsDatePickerChangeEvent) => {
    props.onChange &&
      props.onChange(event, new Date(event.nativeEvent.newDate));
  };

  // The Date object returns timezone in minutes. Convert that to seconds
  // and multiply by -1 so that the offset can be added to UTC+0 time to get
  // the correct value on the native side.
  let timezoneOffsetInSeconds = props.timeZoneOffsetInSeconds;
  if (timezoneOffsetInSeconds == null && props.value != null) {
    timezoneOffsetInSeconds = -60 * props.value.getTimezoneOffset();
  }

  // 'date' is the default mode
  if (props.mode === 'date' || props.mode == null) {
    return (
      <RNDateTimePickerWindows
        {...localProps}
        onChange={_onChange}
        timeZoneOffsetInSeconds={timezoneOffsetInSeconds}
      />
    );
  } else if (props.mode === 'time') {
    return (
      <RNTimePickerWindows
        style={props.style}
        is24Hour={props.is24Hour}
        selectedTime={localProps.selectedDate}
        minuteInterval={props.minuteInterval}
        onChange={_onChange}
      />
    );
  }
}
