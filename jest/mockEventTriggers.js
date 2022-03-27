/**
 * @format
 * @flow strict-local
 */
import * as androidUtils from '../src/androidUtils';
import {DATE_SET_ACTION, DISMISS_ACTION} from '../src/constants';
import type {PresentPickerCallback} from '../src/androidUtils';

export const mockAndroidDialogDateChange = (datePickedByUser: Date) => {
  jest.spyOn(androidUtils, 'getOpenPicker').mockImplementation(() => {
    async function fakeDateTimePickerAndroidOpener({
      value: timestampFromPickerValueProp,
    }) {
      const pickedDate = new Date(timestampFromPickerValueProp);
      pickedDate.setFullYear(
        datePickedByUser.getFullYear(),
        datePickedByUser.getMonth(),
        datePickedByUser.getDate(),
      );

      return {
        action: DATE_SET_ACTION,
        year: pickedDate.getFullYear(),
        month: pickedDate.getMonth(),
        day: pickedDate.getDate(),
        hour: pickedDate.getHours(),
        minute: pickedDate.getMinutes(),
      };
    }
    return (fakeDateTimePickerAndroidOpener: PresentPickerCallback);
  });
};

export const mockAndroidDialogDismissal = () => {
  jest.spyOn(androidUtils, 'getOpenPicker').mockImplementation(() => {
    async function fakeDateTimePickerAndroidOpener() {
      return {
        action: DISMISS_ACTION,
      };
    }
    // $FlowExpectedError - the typings actually don't 100% reflect the native module behavior
    return (fakeDateTimePickerAndroidOpener: PresentPickerCallback);
  });
};
