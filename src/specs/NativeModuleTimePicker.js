// @flow strict-local

import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
import {TurboModuleRegistry} from 'react-native';

export type TimePickerOpenParams = $ReadOnly<{
  dialogButtons?: $ReadOnly<{string: string}>,
  display?: string,
  is24Hour?: boolean,
  minuteInterval?: number,
  timeZoneOffsetInMinutes?: number,
}>;

type TimeSetAction = 'timeSetAction' | 'dismissedAction';
type TimePickerResult = $ReadOnly<{
  action: TimeSetAction,
  timestamp: number,
  utcOffset: number,
}>;

export interface Spec extends TurboModule {
  +dismiss: () => Promise<boolean>;
  +open: (params: TimePickerOpenParams) => Promise<TimePickerResult>;
}

export default (TurboModuleRegistry.getEnforcing<Spec>('RNCTimePicker'): ?Spec);
