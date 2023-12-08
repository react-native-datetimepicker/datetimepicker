/**
 * MIT License
 *
 * Copyright (C) 2023 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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
//import {Platform} from 'react-native';

import type {
  DateTimePickerEvent,
  NativeEventIOS,
  IOSNativeProps,
  IOSDisplay,
} from './types';

// const getDisplaySafe = (display: IOSDisplay): IOSDisplay=>{
//     const majorVersionIOS = parseInt(Platfrom.Version, 10);
//     if(display === IOS_DISPLAY.inline && majorVersionIOS < 14){
//         // inline is available since 14.0
//         return IOS_DISPLAY.spinner;
//     }
//     if(majorVersionIOS < 14){
//         // NOTE this should compare against 13.4, not 14 according to https://developer.apple.com/documentation/uikit/uidatepickerstyle/uidatepickerstylecompact?changes=latest_minor&language=objc
//         // but UIDatePickerStyleCompact does not seem to work prior to 14
//         // only the spinner display (UIDatePickerStyleWheels) is thus available below 14
//         return IOS_DISPLAY.spinner;
//     }
//
//     return display
// }

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
  disabled = false,
  is24Hour = true,
  ...other
}: IOSNativeProps): React.Node {
  sharedPropsValidation({value, timeZoneOffsetInMinutes, timeZoneName});

  // const display = getDisplaySafe(providedDisplay)
  const display = providedDisplay;

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
      is24Hour={is24Hour}
    />
  );
}
