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
import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import invariant from 'invariant';

import RNDateTimePicker from './picker';
import {toMilliseconds} from './utils';
import {MODE_DATE} from './constants';

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

function Picker({
  mode = MODE_DATE,
  value,
  locale,
  maximumDate,
  minimumDate,
  style,
  testID,
  minuteInterval,
  timeZoneOffsetInMinutes,
  textColor,
  onChange,
  isDarkModeEnabled,
}: IOSNativeProps) {
  const dates: DatePickerOptions = {value, maximumDate, minimumDate};
  const picker: NativeRef = React.createRef();
  const textColorByDarkModeEnabled = isDarkModeEnabled
    ? Colors.white
    : Colors.black;

  useEffect(() => {
    if (value && onChange && picker.current) {
      picker.current.setNativeProps({
        date: value.getTime(),
      });
    }
  }, [onChange, picker, value]);

  function onChangeValue(event: Event) {
    const {
      nativeEvent: {timestamp},
    } = event;

    let date;

    if (timestamp) {
      date = new Date(timestamp);
    }

    onChange && onChange(event, date);
  }

  invariant(value, 'A date or time should be specified as `value`.');

  toMilliseconds(dates, 'value', 'minimumDate', 'maximumDate');

  return (
    <RNDateTimePicker
      testID={testID}
      ref={picker}
      style={[styles.picker, style]}
      date={dates.value}
      locale={locale !== null && locale !== '' ? locale : undefined}
      maximumDate={dates.maximumDate}
      minimumDate={dates.minimumDate}
      mode={mode}
      minuteInterval={minuteInterval}
      timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
      onChange={onChangeValue}
      textColor={textColor || textColorByDarkModeEnabled}
      onStartShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
    />
  );
}

export default Picker;
