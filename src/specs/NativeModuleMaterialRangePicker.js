// @flow strict-local

import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
import {TurboModuleRegistry} from 'react-native';

export type RangePickerOpenParams = $ReadOnly<{
  dialogButtons?: $ReadOnly<{string: string}>,
  initialInputMode?: string,
  title?: string,
  maximumDate?: number,
  minimumDate?: number,
  startTimestamp?: number,
  endTimestamp?: number,
  testID?: string,
  timeZoneName?: number,
  timeZoneOffsetInMinutes?: number,
}>;

type RangeSetAction = 'rangeSetAction' | 'dismissedAction';
type RangePickerResult = $ReadOnly<{
  action: RangeSetAction,
  startTimestamp: number,
  endTimestamp: number,
  utcOffset: number,
}>;

export interface Spec extends TurboModule {
  +dismiss: () => Promise<boolean>;
  +open: (params: RangePickerOpenParams) => Promise<RangePickerResult>;
}

export default (TurboModuleRegistry.getEnforcing<Spec>(
  'RNCMaterialRangePicker',
): ?Spec);
