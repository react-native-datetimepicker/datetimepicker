/**
 * @flow strict-local
 */
import type {DateTimePickerEvent, RangePickerEvent, Range} from './types';
import {ANDROID_EVT_TYPE, EVENT_TYPE_SET} from './constants';

export const createDateTimeSetEvtParams = (
  date: Date,
  utcOffset: number,
): [DateTimePickerEvent, Date] => {
  return [
    {
      type: EVENT_TYPE_SET,
      nativeEvent: {
        timestamp: date.getTime(),
        utcOffset,
      },
    },
    date,
  ];
};

export const createRangeSetEvtParams = (
  range: Range,
  utcOffset: number,
): RangePickerEvent => {
  return {
    type: EVENT_TYPE_SET,
    nativeEvent: {
      startTimestamp: range.start ? range.start.getTime() : 0,
      endTimestamp: range.end ? range.end.getTime() : 0,
      utcOffset,
    },
  };
};

export const createDismissEvtParams = (
  date: Date,
  utcOffset: number,
): [DateTimePickerEvent, Date] => {
  return [
    {
      type: ANDROID_EVT_TYPE.dismissed,
      nativeEvent: {
        timestamp: date.getTime(),
        utcOffset,
      },
    },
    date,
  ];
};

export const createRangeDismissEvtParams = (
  range: Range,
  utcOffset: number,
): [RangePickerEvent, Range] => {
  return [
    {
      type: ANDROID_EVT_TYPE.dismissed,
      nativeEvent: {
        startTimestamp: range.start ? range.start.getTime() : 0,
        endTimestamp: range.end ? range.end.getTime() : 0,
        utcOffset,
      },
    },
    range,
  ];
};

export const createNeutralEvtParams = (
  date: Date,
  utcOffset: number,
): [DateTimePickerEvent, Date] => {
  return [
    {
      type: ANDROID_EVT_TYPE.neutralButtonPressed,
      nativeEvent: {
        timestamp: date.getTime(),
        utcOffset,
      },
    },
    date,
  ];
};
