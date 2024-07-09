// @flow strict-local

import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
import {TurboModuleRegistry} from 'react-native';

export type DatePickerOpenParams = $ReadOnly<{
  dialogButtons?: $ReadOnly<{string: string}>,
  display?: string,
  maximumDate?: number,
  minimumDate?: number,
  testID?: string,
  timeZoneName?: number,
  timeZoneOffsetInMinutes?: number,
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

export default (TurboModuleRegistry.getEnforcing<Spec>('RNCDatePicker'): ?Spec);
