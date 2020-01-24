/**
 * @format
 * @flow strict-local
 */
import {
  MODE_DATE,
  MODE_TIME,
  DISPLAY_DEFAULT,
  DATE_SET_ACTION,
  TIME_SET_ACTION,
  DISMISS_ACTION,
  NEUTRAL_BUTTON_ACTION,
} from './constants';
import pickers from './picker';
import invariant from 'invariant';
import React, {Fragment} from 'react';

import type {AndroidEvent, AndroidNativeProps} from './types';

export default function RNDateTimePicker({
  mode,
  value,
  display,
  onChange,
  is24Hour,
  minimumDate,
  maximumDate,
  neutralButtonLabel,
}: AndroidNativeProps) {
  invariant(value, 'A date or time should be specified as `value`.');
  let picker;

  switch (mode) {
    case MODE_TIME:
      picker = pickers[MODE_TIME].open({
        value,
        display,
        is24Hour,
        neutralButtonLabel,
      });
      break;

    case MODE_DATE:
    default:
      picker = pickers[MODE_DATE].open({
        value,
        display,
        minimumDate,
        maximumDate,
        neutralButtonLabel,
      });
      break;
  }

  picker.then(
    function resolve({action, day, month, year, minute, hour}) {
      const date = new Date();
      const event: AndroidEvent = {
        type: 'set',
        nativeEvent: {},
      };

      switch (action) {
        case DATE_SET_ACTION:
          event.nativeEvent.timestamp = date.setFullYear(year, month, day);
          onChange(event, date);
          break;

        case TIME_SET_ACTION:
          event.nativeEvent.timestamp = date.setHours(hour, minute);
          onChange(event, date);
          break;

        case DISMISS_ACTION:
        default:
          event.type = 'dismissed';
          onChange(event);
          break;
        case NEUTRAL_BUTTON_ACTION:
          event.type = 'neutralButtonPressed';
          onChange(event);
          break;
      }
    },
    function reject(error) {
      // ignore or throw `activity == null` error
      throw error;
    },
  );

  return <Fragment />;
}

RNDateTimePicker.defaultProps = {
  display: DISPLAY_DEFAULT,
  mode: MODE_DATE,
};
