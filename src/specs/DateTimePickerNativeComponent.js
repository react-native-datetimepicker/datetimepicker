// @flow strict-local
import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {ColorValue} from 'react-native/Libraries/StyleSheet/StyleSheet';
import type {HostComponent} from 'react-native';

import type {
  BubblingEventHandler,
  Double,
  Int32,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

type DateTimePickerEvent = $ReadOnly<{|
  timestamp: Double,
  utcOffset: Int32,
|}>;

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  accentColor?: ?ColorValue,
  date?: ?Double,
  displayIOS?: WithDefault<
    'default' | 'spinner' | 'compact' | 'inline',
    'default',
  >,
  locale?: ?string,
  maximumDate?: ?Double,
  minimumDate?: ?Double,
  minuteInterval?: ?Int32,
  mode?: WithDefault<'date' | 'time' | 'datetime' | 'countdown', 'date'>,
  onChange?: ?BubblingEventHandler<DateTimePickerEvent>,
  onPickerDismiss?: ?BubblingEventHandler<null>,
  textColor?: ?ColorValue,
  themeVariant?: WithDefault<'dark' | 'light' | 'unspecified', 'unspecified'>,
  timeZoneName?: ?string,
  timeZoneOffsetInMinutes?: ?Double,
  enabled?: WithDefault<boolean, true>,
|}>;

export default (codegenNativeComponent<NativeProps>('RNDateTimePicker', {
  excludedPlatforms: ['android'],
  interfaceOnly: true,
}): HostComponent<NativeProps>);
