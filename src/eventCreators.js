/**
 * @flow strict-local
 */
import type {DateTimePickerEvent} from './types';
import {ANDROID_EVT_TYPE, EVENT_TYPE_SET} from './constants';

export const createDateTimeSetEvtParams = (
  date: Date,
): [DateTimePickerEvent, Date] => {
  return [
    {
      type: EVENT_TYPE_SET,
      nativeEvent: {
        timestamp: date.getTime(),
      },
    },
    date,
  ];
};

export const createDismissEvtParams = (
  date: Date,
): [DateTimePickerEvent, Date] => {
  return [
    {
      type: ANDROID_EVT_TYPE.dismissed,
      nativeEvent: {
        timestamp: date.getTime(),
      },
    },
    date,
  ];
};

export const createNeutralEvtParams = (
  date: Date,
): [DateTimePickerEvent, Date] => {
  return [
    {
      type: ANDROID_EVT_TYPE.neutralButtonPressed,
      nativeEvent: {
        timestamp: date.getTime(),
      },
    },
    date,
  ];
};
