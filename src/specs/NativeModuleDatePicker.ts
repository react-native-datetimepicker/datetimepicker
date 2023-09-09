import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
import {TurboModuleRegistry} from 'react-native';
import type {DatePickerOptions, DateTimePickerResult} from '../types';

type OpenParams = Readonly<DatePickerOptions>;

export interface Spec extends TurboModule {
  dismiss(): Promise<boolean>;
  open(params: OpenParams): Promise<DateTimePickerResult>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNCDatePicker');
