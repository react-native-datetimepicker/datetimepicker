/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 * @format
 * @flow strict-local
 */
'use strict';

import {
  type HostComponent,
  requireNativeComponent,
  StyleSheet,
} from 'react-native';
import type {
  WindowsNativeProps,
  WindowsDatePickerChangeEvent,
  DateTimePickerEvent,
} from './types';
import * as React from 'react';
import {EVENT_TYPE_SET, WINDOWS_MODE} from './constants';
import {sharedPropsValidation} from './utils';

const styles = StyleSheet.create({
  rnDatePicker: {
    height: 32,
    width: 150,
  },
});

// $FlowExpectedError - this export is used in tests only, so don't care
export const RNDateTimePickerWindows = requireNativeComponent(
  'RNDateTimePickerWindows',
);

// $FlowFixMe[underconstrained-implicit-instantiation]
const RNTimePickerWindows = requireNativeComponent('RNTimePickerWindows');

export default function RNDateTimePickerQWE(
  props: WindowsNativeProps,
): React.Node {
  sharedPropsValidation({value: props?.value});

  const localProps = {
    accessibilityLabel: props.accessibilityLabel,
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
    const {onChange} = props;
    const unifiedEvent: DateTimePickerEvent = {
      ...event,
      nativeEvent: {
        ...event.nativeEvent,
        timestamp: event.nativeEvent.newDate,
        utcOffset: 0,
      },
      type: EVENT_TYPE_SET,
    };

    onChange && onChange(unifiedEvent, new Date(event.nativeEvent.newDate));
  };

  // $FlowFixMe[recursive-definition]
  const timezoneOffsetInSeconds = (() => {
    // The Date object returns timezone in minutes. Convert that to seconds
    // and multiply by -1 so that the offset can be added to UTC+0 time to get
    // the correct value on the native side.
    if (timezoneOffsetInSeconds == null && props.value != null) {
      return -60 * props.value.getTimezoneOffset();
    }
    return props.timeZoneOffsetInSeconds;
  })();
  const {mode} = props;

  // 'date' is the default mode
  if (mode === WINDOWS_MODE.date || mode == null) {
    return (
      <RNDateTimePickerWindows
        {...localProps}
        onChange={_onChange}
        timeZoneOffsetInSeconds={timezoneOffsetInSeconds}
      />
    );
  } else if (mode === WINDOWS_MODE.time) {
    return (
      <RNTimePickerWindows
        style={props.style}
        is24Hour={props.is24Hour}
        selectedTime={localProps.selectedDate}
        minuteInterval={props.minuteInterval}
        onChange={_onChange}
      />
    );
  } else {
    console.error(`RNDateTimePicker: unknown mode ${mode}`);
    return null;
  }
}
