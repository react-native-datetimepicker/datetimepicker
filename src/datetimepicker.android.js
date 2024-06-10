/**
 * @format
 * @flow strict-local
 */
import {ANDROID_DISPLAY, ANDROID_MODE} from './constants';
import {useEffect} from 'react';

import type {AndroidNativeProps} from './types';
import {validateAndroidProps} from './androidUtils';
import {DateTimePickerAndroid} from './DateTimePickerAndroid';

export default function RNDateTimePickerAndroid(
  props: AndroidNativeProps,
): null {
  validateAndroidProps(props);
  const {
    mode = ANDROID_MODE.date,
    display = ANDROID_DISPLAY.default,
    value,
    onChange,
    is24Hour,
    minimumDate,
    maximumDate,
    minuteInterval,
    onError,
    timeZoneOffsetInMinutes,
    timeZoneName,
    positiveButton,
    negativeButton,
    neutralButton,
    positiveButtonLabel,
    negativeButtonLabel,
    neutralButtonLabel,
    testID,
    firstDayOfWeek,
  } = props;
  const valueTimestamp = value.getTime();

  useEffect(() => {
    // This effect runs on unmount / with mode change, and will ensure the picker is closed.
    // This allows for controlling the opening state of the picker through declarative logic in jsx.
    return () => DateTimePickerAndroid.dismiss(mode);
  }, [mode]);

  useEffect(
    function showOrUpdatePicker() {
      const params = {
        mode,
        value: new Date(valueTimestamp),
        display,
        is24Hour,
        minimumDate,
        maximumDate,
        minuteInterval,
        timeZoneOffsetInMinutes,
        timeZoneName,
        onError,
        onChange,
        positiveButton,
        negativeButton,
        neutralButton,
        positiveButtonLabel,
        negativeButtonLabel,
        neutralButtonLabel,
        testID,
        firstDayOfWeek,
      };
      DateTimePickerAndroid.open(params);
    },
    // the android dialog, when presented, will actually ignore updates to all props other than `value`
    // as an alternative, use the DateTimePickerAndroid whose reason for existence is described in
    // https://github.com/react-native-datetimepicker/datetimepicker/pull/327#issuecomment-723160992
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onChange, valueTimestamp, mode],
  );

  return null;
}
