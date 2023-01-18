// @flow strict-local

import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
import {TurboModuleRegistry} from 'react-native';
import type {DateTimePickerResult} from '../types';

export interface Spec extends TurboModule {
  dismiss(): Promise<boolean>;
  open(): Promise<DateTimePickerResult>;
}

export default (TurboModuleRegistry.get<Spec>('RNDatePicker'): ?Spec);
