// @flow strict-local

import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
import {TurboModuleRegistry} from 'react-native';
import type {DateTimePickerResult} from '../types';

type OpenParams = $ReadOnly<{|
  // TODO does codegen handle object type?
|}>;
export interface Spec extends TurboModule {
  dismiss(): Promise<boolean>;
  open(params: OpenParams): Promise<DateTimePickerResult>;
}

export default (TurboModuleRegistry.getEnforcing<Spec>('RNDatePicker'): ?Spec);
