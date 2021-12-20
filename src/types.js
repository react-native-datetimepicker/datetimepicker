/**
 * @format
 * @flow strict-local
 */

import type {SyntheticEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import type {HostComponent} from 'react-native';
import type {ViewProps} from 'react-native/Libraries/Components/View/ViewPropTypes';
import type {ElementRef} from 'react';
import type {ColorValue} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {
  ANDROID_MODE,
  ANDROID_DISPLAY,
  DAY_OF_WEEK,
  IOS_DISPLAY,
  IOS_MODE,
  WINDOWS_MODE,
} from './constants';

export type IOSDisplay = $Keys<typeof IOS_DISPLAY>;
export type IOSMode = $Keys<typeof IOS_MODE>;
type AndroidMode = $Keys<typeof ANDROID_MODE>;
type WindowsMode = $Keys<typeof WINDOWS_MODE>;
type Display = $Keys<typeof ANDROID_DISPLAY>;
type MinuteInterval = ?(1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30);

export type Event = SyntheticEvent<
  $ReadOnly<{|
    timestamp: number,
  |}>,
>;

export type AndroidEvent = {|
  type: string,
  nativeEvent: {|
    timestamp?: number,
  |},
|};

type BaseOptions = {|
  /**
   * The currently selected date.
   */
  value?: ?Date,

  /**
   * Date change handler.
   *
   * This is called when the user changes the date or time in the UI.
   * The first argument is an Event, the second a selected Date.
   */
  onChange?: ?(event: Event, date?: Date) => void,
|};

type DateOptions = {|
  ...BaseOptions,

  /**
   * Maximum date.
   *
   * Restricts the range of possible date/time values.
   */
  maximumDate?: ?Date,

  /**
   * Minimum date.
   *
   * Restricts the range of possible date/time values.
   */
  minimumDate?: ?Date,
|};

type TimeOptions = $ReadOnly<{|
  ...BaseOptions,

  /**
   * Display TimePicker in 24 hour.
   */
  is24Hour?: ?boolean,
|}>;

export type BaseProps = $ReadOnly<{|
  ...ViewProps,
  ...DateOptions,
|}>;

export type IOSNativeProps = $ReadOnly<{|
  ...BaseProps,
  date?: ?Date,

  /**
   * The date picker locale.
   */
  locale?: ?string,

  /**
   * The interval at which minutes can be selected.
   */
  minuteInterval?: MinuteInterval,

  /**
   * The date picker mode.
   */
  mode?: IOSMode,

  /**
   * Timezone offset in minutes.
   *
   * By default, the date picker will use the device's timezone. With this
   * parameter, it is possible to force a certain timezone offset. For
   * instance, to show times in Pacific Standard Time, pass -7 * 60.
   */
  timeZoneOffsetInMinutes?: ?number,

  /**
   * The date picker text color.
   */
  textColor?: ?ColorValue,

  /**
   * Override theme variant used by iOS native picker
   */
  themeVariant?: 'dark' | 'light',

  /**
   * Sets the preferredDatePickerStyle for picker
   */
  display?: IOSDisplay,

  /**
   * Is this picker enabled?
   */
  enabled: boolean,
|}>;

export type AndroidNativeProps = $ReadOnly<{|
  ...BaseProps,
  ...DateOptions,
  ...TimeOptions,

  /**
   * The date picker mode.
   */
  mode: AndroidMode,

  /**
   * The display options.
   */
  display: Display,

  /**
   * Timezone offset in minutes.
   *
   * By default, the date picker will use the device's timezone. With this
   * parameter, it is possible to force a certain timezone offset. For
   * instance, to show times in Pacific Standard Time, pass -7 * 60.
   */
  timeZoneOffsetInMinutes?: ?number,
  /**
   * The interval at which minutes can be selected.
   */
  minuteInterval?: MinuteInterval,

  onChange: (event: AndroidEvent, date?: Date) => void,
  neutralButtonLabel?: string,
|}>;

export type DatePickerOptions = {|
  ...DateOptions,
  display?: Display,
|};

export type TimePickerOptions = {|
  ...TimeOptions,
  minuteInterval?: MinuteInterval,
  display?: Display,
|};

export type DateTimePickerResult = $ReadOnly<{|
  action: ?('timeSetAction' | 'dateSetAction' | 'dismissedAction'),
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
|}>;

export type RCTDateTimePickerNative = Class<HostComponent<IOSNativeProps>>;
export type NativeRef = {
  current: ElementRef<RCTDateTimePickerNative> | null,
};

export type WindowsDatePickerChangeEvent = {|
  nativeEvent: {|
    newDate: number,
  |},
|};

export type WindowsNativeProps = $ReadOnly<{|
  ...BaseProps,
  mode: WindowsMode,
  onChange?: (event: WindowsDatePickerChangeEvent, date: Date) => void,

  placeholderText?: string,
  dateFormat?:
    | 'day month year'
    | 'dayofweek day month'
    | 'longdate'
    | 'shortdate',
  dayOfWeekFormat?:
    | '{dayofweek.abbreviated(2)}'
    | '{dayofweek.abbreviated(3)}'
    | '{dayofweek.full}',
  firstDayOfWeek?: typeof DAY_OF_WEEK,
  timeZoneOffsetInSeconds?: number,
  is24Hour?: boolean,
  minuteInterval?: number,
|}>;
