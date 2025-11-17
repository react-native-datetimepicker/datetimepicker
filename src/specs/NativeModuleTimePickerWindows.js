// @flow strict-local

import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
import {TurboModuleRegistry} from 'react-native';

export type TimePickerOpenParams = $ReadOnly<{
  is24Hour?: boolean,
  minuteInterval?: number,
  selectedTime?: number,
  testID?: string,
}>;

type TimeSetAction = 'timeSetAction' | 'dismissedAction';
type TimePickerResult = $ReadOnly<{
  action: TimeSetAction,
  hour: number,
  minute: number,
}>;

export interface Spec extends TurboModule {
  +dismiss: () => Promise<boolean>;
  +open: (params: TimePickerOpenParams) => Promise<TimePickerResult>;
}

export default (TurboModuleRegistry.getEnforcing<Spec>('RNCTimePickerWindows'): ?Spec);
