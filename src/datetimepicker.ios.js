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
import RNDateTimePicker from './picker';
import {toMilliseconds} from './utils';
import {IOS_DISPLAY, MODE_DATE} from './constants';
import invariant from 'invariant';
import React, {useEffect, useState} from 'react';
import {getPickerHeightStyle} from './layoutUtilsIOS';
import {Platform, StyleSheet} from 'react-native';

import type {
  Event,
  NativeRef,
  IOSNativeProps,
  DatePickerOptions,
  IOSDisplay,
} from './types';

const getDisplaySafe = (display: IOSDisplay) => {
  const majorVersionIOS = parseInt(Platform.Version, 10);
  if (display === IOS_DISPLAY.inline && majorVersionIOS < 14) {
    // inline is available since 14.0
    return IOS_DISPLAY.spinner;
  }
  if (majorVersionIOS < 14) {
    // NOTE this should compare against 13.4, not 14 according to https://developer.apple.com/documentation/uikit/uidatepickerstyle/uidatepickerstylecompact?changes=latest_minor&language=objc
    // but UIDatePickerStyleCompact does not seem to work prior to 14
    // only the spinner display (UIDatePickerStyleWheels) is thus available below 14
    return IOS_DISPLAY.spinner;
  }

  return display;
};

export default function Picker({
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
  themeVariant,
  onChange,
  disabled = false,
  ...otherProps
}: IOSNativeProps) {
  const [heightStyle, setHeightStyle] = useState(undefined);
  const _picker: NativeRef = React.useRef();
  const display = getDisplaySafe(otherProps.display);

  useEffect(
    function ensureNativeIsInSyncWithJS() {
      const {current} = _picker;

      if (value && onChange && current) {
        const timestamp = value.getTime();
        current.setNativeProps({
          date: timestamp,
        });
      }
    },
    [onChange, value],
  );

  useEffect(
    function ensureCorrectHeight() {
      const height = getPickerHeightStyle(display, mode);
      if (height instanceof Promise) {
        height.then((measuredStyle) => setHeightStyle(measuredStyle));
      } else {
        setHeightStyle(height);
      }
    },
    [display, mode],
  );

  const _onChange = (event: Event) => {
    const timestamp = event.nativeEvent.timestamp;
    let date;

    if (timestamp) {
      date = new Date(timestamp);
    }

    onChange && onChange(event, date);
  };

  invariant(value, 'A date or time should be specified as `value`.');

  if (!heightStyle) {
    // wait for height to be available in state
    return null;
  }

  const dates: DatePickerOptions = {value, maximumDate, minimumDate};
  toMilliseconds(dates, 'value', 'minimumDate', 'maximumDate');

  return (
    <RNDateTimePicker
      testID={testID}
      ref={_picker}
      style={StyleSheet.compose(heightStyle, style)}
      date={dates.value}
      locale={locale !== null && locale !== '' ? locale : undefined}
      maximumDate={dates.maximumDate}
      minimumDate={dates.minimumDate}
      mode={mode}
      minuteInterval={minuteInterval}
      timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
      onChange={_onChange}
      textColor={textColor}
      themeVariant={themeVariant}
      onStartShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      displayIOS={display}
      disabled={disabled === true}
    />
  );
}

Picker.defaultProps = {
  mode: MODE_DATE,
  display: IOS_DISPLAY.default,
};
