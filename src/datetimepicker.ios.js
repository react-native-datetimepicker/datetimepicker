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
import {dateToMilliseconds, sharedPropsValidation} from './utils';
import {
  IOS_DISPLAY,
  EVENT_TYPE_SET,
  EVENT_TYPE_DISMISSED,
  IOS_MODE,
} from './constants';
import * as React from 'react';
import {Platform} from 'react-native';

import type {
  DateTimePickerEvent,
  NativeEventIOS,
  IOSNativeProps,
  IOSDisplay,
} from './types';

const getDisplaySafe = (display: IOSDisplay): IOSDisplay => {
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
  minuteInterval,
  timeZoneOffsetInMinutes,
  timeZoneName,
  textColor,
  accentColor,
  themeVariant,
  onChange,
  mode = IOS_MODE.date,
  display: providedDisplay = IOS_DISPLAY.default,
  // $FlowFixMe[incompatible-type]
  disabled = false,
  ...other
}: IOSNativeProps): React.Node {
  sharedPropsValidation({value, timeZoneOffsetInMinutes, timeZoneName});

  const display = getDisplaySafe(providedDisplay);

  const _onChange = (event: NativeEventIOS) => {
    const timestamp = event.nativeEvent.timestamp;
    const unifiedEvent: DateTimePickerEvent = {
      ...event,
      type: EVENT_TYPE_SET,
    };

    const date = timestamp !== undefined ? new Date(timestamp) : undefined;

    onChange && onChange(unifiedEvent, date);
  };

  const onDismiss = () => {
    // TODO introduce separate onDismissed event listener
    onChange &&
      onChange(
        {
          type: EVENT_TYPE_DISMISSED,
          nativeEvent: {
            timestamp: value.getTime(),
            utcOffset: 0, // TODO vonovak - the dismiss event should not carry any date information
          },
        },
        value,
      );
  };

  return (
    <RNDateTimePicker
      {...other}
      date={dateToMilliseconds(value)}
      locale={locale !== null && locale !== '' ? locale : undefined}
      maximumDate={dateToMilliseconds(maximumDate)}
      minimumDate={dateToMilliseconds(minimumDate)}
      mode={mode}
      minuteInterval={minuteInterval}
      timeZoneOffsetInMinutes={timeZoneOffsetInMinutes}
      timeZoneName={timeZoneName}
      onChange={_onChange}
      onPickerDismiss={onDismiss}
      textColor={textColor}
      accentColor={accentColor}
      themeVariant={themeVariant}
      onStartShouldSetResponder={() => true}
      onResponderTerminationRequest={() => false}
      displayIOS={display}
      enabled={disabled !== true}
    />
  );
}
