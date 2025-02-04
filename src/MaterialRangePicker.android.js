/**
 * @format
 * @flow strict-local
 */

import type {MaterialRangeProps, Range} from './types';
import RNMaterialRangePickerAndroid from './specs/NativeModuleMaterialRangePicker';
import {DISMISS_ACTION, RANGE_SET_ACTION} from './constants';
import {
  createRangeDismissEvtParams,
  createRangeSetEvtParams,
} from './eventCreators';

async function open({
  onChange,
  value = {},
  maximumDate,
  minimumDate,
  onError,
  ...props
}: MaterialRangeProps = {}) {
  try {
    const result = await RNMaterialRangePickerAndroid.open({
      startTimestamp: value.start?.getTime(),
      endTimestamp: value.end?.getTime(),
      maximumDate: maximumDate?.getTime(),
      minimumDate: minimumDate?.getTime(),
      ...props,
    });

    const {action, startTimestamp, endTimestamp, utcOffset} = result;
    switch (action) {
      case RANGE_SET_ACTION: {
        const range: Range = {
          start: new Date(startTimestamp),
          end: new Date(endTimestamp),
        };

        const event = createRangeSetEvtParams(range, utcOffset);
        onChange?.(event, range);
        break;
      }
      case DISMISS_ACTION:
      default: {
        const [event] = createRangeDismissEvtParams(value, utcOffset);
        onChange?.(event);
        break;
      }
    }
  } catch (error) {
    onError?.(error);
  }
}

function dismiss(): Promise<boolean> {
  return RNMaterialRangePickerAndroid.dismiss();
}

export const MaterialRangePicker = {open, dismiss};
