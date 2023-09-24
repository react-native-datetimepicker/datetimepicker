/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
'use strict';

import {
  requireNativeComponent,
  StyleProp,
  StyleSheet,
  ViewStyle,
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

type DateTimePickerWindowsNativeProps = Omit<
  WindowsNativeProps,
  'onChange' | 'mode' | 'value'
> & {
  onChange: (event: WindowsDatePickerChangeEvent) => void;
};
export const RNDateTimePickerWindows =
  requireNativeComponent<DateTimePickerWindowsNativeProps>(
    'RNDateTimePickerWindows',
  );

type TimePickerWindowsNativeProps = {
  style?: StyleProp<ViewStyle>;
  is24Hour?: boolean;
  selectedTime?: number;
  minuteInterval?: number;
  onChange: (event: WindowsDatePickerChangeEvent) => void;
};
const RNTimePickerWindows =
  requireNativeComponent<TimePickerWindowsNativeProps>('RNTimePickerWindows');

export default function RNDateTimePickerQWE(
  props: WindowsNativeProps,
): React.ReactNode {
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

    onChange?.(unifiedEvent, new Date(event.nativeEvent.newDate));
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
