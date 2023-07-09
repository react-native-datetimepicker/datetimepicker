// @ts-ignore Not able to find exported module
import type {SyntheticEvent} from 'react-native/Libraries/Types/CoreEventTypes';
import type {HostComponent, processColor} from 'react-native';
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
  ANDROID_EVT_TYPE,
} from './constants';

export type IOSDisplay = keyof typeof IOS_DISPLAY;
export type IOSMode = keyof typeof IOS_MODE;
type AndroidMode = keyof typeof ANDROID_MODE;
type WindowsMode = keyof typeof WINDOWS_MODE;
type Display = keyof typeof ANDROID_DISPLAY;
type AndroidEvtTypes = keyof typeof ANDROID_EVT_TYPE;
type MinuteInterval =
  | undefined
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 10
  | 12
  | 15
  | 20
  | 30;

export type ProcessedButton = {
  label: string;
  textColor: ReturnType<typeof processColor>;
};

export type NativeEventIOS = SyntheticEvent<
  Readonly<{
    timestamp: number;
    utcOffset: number;
  }>
>;

export type DateTimePickerEvent = {
  type: AndroidEvtTypes;
  nativeEvent: Readonly<{
    timestamp: number;
    utcOffset: number;
  }>;
};

type BaseOptions = {
  /**
   * The currently selected date.
   */
  value: Date;

  /**
   * change handler.
   *
   * This is called when the user changes the date or time in the UI.
   * Or when they clear / dismiss the dialog.
   * The first argument is an Event, the second a selected Date.
   */
  onChange?: (event: DateTimePickerEvent, date?: Date) => void;
};

type DateOptions = BaseOptions & {
  /**
   * Maximum date.
   *
   * Restricts the range of possible date/time values.
   */
  maximumDate?: Date;

  /**
   * Minimum date.
   *
   * Restricts the range of possible date/time values.
   */
  minimumDate?: Date;
};

type TimeOptions = Readonly<
  BaseOptions & {
    /**
     * Display TimePicker in 24 hour.
     */
    is24Hour?: boolean;
  }
>;

type ViewPropsWithoutChildren = Omit<ViewProps, 'children'>;

export type BaseProps = Readonly<
  ViewPropsWithoutChildren &
    DateOptions & /**
     * Timezone in database name.
     *
     * By default, the date picker will use the device's timezone. With this
     * parameter, it is possible to force a certain timezone based on IANA
     */ {timeZoneName?: string}
>;

export type IOSNativeProps = Readonly<
  BaseProps & {
    /**
     * The date picker locale.
     */
    locale?: string;

    /**
     * The interval at which minutes can be selected.
     */
    minuteInterval?: MinuteInterval;

    /**
     * The date picker mode.
     */
    mode?: IOSMode;

    /**
     * Timezone offset in minutes.
     *
     * By default, the date picker will use the device's timezone. With this
     * parameter, it is possible to force a certain timezone offset. For
     * instance, to show times in Pacific Standard Time, pass -7 * 60.
     */
    timeZoneOffsetInMinutes?: number;

    /**
     * The date picker text color.
     */
    textColor?: ColorValue;

    /**
     * The date picker accent color.
     *
     * Sets the color of the selected, date and navigation icons.
     * Has no effect for display 'spinner'.
     */
    accentColor?: ColorValue;

    /**
     * Override theme variant used by iOS native picker
     */
    themeVariant?: 'dark' | 'light';

    /**
     * Sets the preferredDatePickerStyle for picker
     */
    display?: IOSDisplay;

    /**
     * Is this picker enabled?
     *
     * FIXME Unused in component
     */
    enabled?: boolean;

    /**
     * Is this picker disabled?
     */
    disabled?: boolean;
  }
>;

export type ButtonType = {label?: string; textColor?: ColorValue};

export type AndroidNativeProps = Readonly<
  BaseProps &
    DateOptions &
    TimeOptions & {
      /**
       * The date picker mode.
       */
      mode: AndroidMode;

      /**
       * The display options.
       */
      display: Display;

      /**
       * Timezone offset in minutes.
       *
       * By default, the date picker will use the device's timezone. With this
       * parameter, it is possible to force a certain timezone offset. For
       * instance, to show times in Pacific Standard Time, pass -7 * 60.
       */
      timeZoneOffsetInMinutes?: number;

      /**
       * The interval at which minutes can be selected.
       */
      minuteInterval?: MinuteInterval;

      positiveButton?: ButtonType;
      neutralButton?: ButtonType;
      negativeButton?: ButtonType;
      /**
       * @deprecated use neutralButton instead
       * */
      neutralButtonLabel?: string;
      /**
       * @deprecated use positiveButton instead
       * */
      positiveButtonLabel?: string;
      /**
       * @deprecated use negativeButton instead
       * */
      negativeButtonLabel?: string;
      onError?: (error: Error) => void;
    }
>;

export type DatePickerOptions = DateOptions & {
  display?: Display;
};

export type TimePickerOptions = TimeOptions & {
  minuteInterval?: MinuteInterval;
  display?: Display;
};

export type DateTimePickerResult = Readonly<{
  action:
    | 'timeSetAction'
    | 'dateSetAction'
    | 'dismissedAction'
    | 'neutralButtonAction';
  timestamp: number;
  utcOffset: number;
}>;

export type RCTDateTimePickerNative = HostComponent<IOSNativeProps>;
export type NativeRef = {
  current: ElementRef<RCTDateTimePickerNative> | null;
};

export type WindowsDatePickerChangeEvent = {
  nativeEvent: {
    newDate: number;
  };
};

export type WindowsNativeProps = Readonly<
  BaseOptions & {
    mode: WindowsMode;

    placeholderText?: string;
    dateFormat?:
      | 'day month year'
      | 'dayofweek day month'
      | 'longdate'
      | 'shortdate';
    dayOfWeekFormat?:
      | '{dayofweek.abbreviated(2)}'
      | '{dayofweek.abbreviated(3)}'
      | '{dayofweek.full}';
    firstDayOfWeek?: typeof DAY_OF_WEEK;
    timeZoneOffsetInSeconds?: number;
    is24Hour?: boolean;
    minuteInterval?: number;
    maximumDate?: Date;
    minimumDate?: Date;
  }
>;