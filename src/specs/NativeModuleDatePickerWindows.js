// @flow strict-local

import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
import {TurboModuleRegistry} from 'react-native';

export type DatePickerOpenParams = $ReadOnly<{
  dayOfWeekFormat?: string,
  dateFormat?: string,
  firstDayOfWeek?: number,
  maximumDate?: number,
  minimumDate?: number,
  placeholderText?: string,
  testID?: string,
  timeZoneOffsetInSeconds?: number,
}>;

type DateSetAction = 'dateSetAction' | 'dismissedAction';
type DatePickerResult = $ReadOnly<{
  action: DateSetAction,
  timestamp: number,
  utcOffset: number,
}>;

export interface Spec extends TurboModule {
  +dismiss: () => Promise<boolean>;
  +open: (params: DatePickerOpenParams) => Promise<DatePickerResult>;
}

export default (TurboModuleRegistry.get<Spec>('RNCDatePickerWindows'): ?Spec);
