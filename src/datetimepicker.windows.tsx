/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
'use strict';

import {requireNativeComponent, StyleSheet} from 'react-native';
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
const RNTimePickerWindows = requireNativeComponent('RNTimePickerWindows');

export default function RNDateTimePickerQWE(
  props: WindowsNativeProps,
): React.ReactNode {
  sharedPropsValidation({value: props?.value});

  const localProps = {
    dayOfWeekFormat: props.dayOfWeekFormat,
    dateFormat: props.dateFormat,
    firstDayOfWeek: props.firstDayOfWeek,
    maxDate: props.maximumDate ? props.maximumDate.getTime() : undefined, // time in milliseconds
    minDate: props.minimumDate ? props.minimumDate.getTime() : undefined, // time in milliseconds
    onChange: props.onChange,
    placeholderText: props.placeholderText,
    selectedDate: props.value ? props.value.getTime() : undefined, // time in milliseconds
    // @ts-ignore Doesn't exist on the props
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

  const timezoneOffsetInSeconds = (() => {
    // The Date object returns timezone in minutes. Convert that to seconds
    // and multiply by -1 so that the offset can be added to UTC+0 time to get
    // the correct value on the native side.
    if (props.timeZoneOffsetInSeconds == null && props.value != null) {
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
        // @ts-ignore Doesnt match on the props
        onChange={_onChange}
        timeZoneOffsetInSeconds={timezoneOffsetInSeconds}
      />
    );
  } else if (mode === WINDOWS_MODE.time) {
    return (
      <RNTimePickerWindows
        // @ts-ignore Doesn't exist on the props
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
