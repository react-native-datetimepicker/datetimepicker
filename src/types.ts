import type {
  HostComponent,
  NativeSyntheticEvent,
  ViewStyle,
  processColor,
} from 'react-native';
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
import {StyleProp} from 'react-native';

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

export type NativeEventIOS = NativeSyntheticEvent<
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

/**
 * Timezone in database name.
 *
 ** By default, the date picker will use the device's timezone. With this
 * parameter, it is possible to force a certain timezone based on IANA
 *
 * Timezone offset in minutes.
 *
 ** By default, the date picker will use the device's timezone. With this
 * parameter, it is possible to force a certain timezone offset. For
 * instance, to show times in Pacific Standard Time, pass -7 * 60.
 */
type TimeZoneOptions = {
  timeZoneName?: string;
  timeZoneOffsetInMinutes?: number;
};

export type BaseProps = Readonly<
  ViewPropsWithoutChildren & DateOptions & TimeZoneOptions
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

export type ButtonType = {
  label?: string;
  textColor?: ReturnType<typeof processColor>;
};

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

export type DatePickerOptions = DateOptions &
  TimeZoneOptions & {
    dialogButtons: {
      positive: ButtonType;
      neutral: ButtonType;
      negative: ButtonType;
    };
    display?: Display;
    testID?: string;
  };

export type TimePickerOptions = TimeOptions &
  TimeZoneOptions & {
    dialogButtons: {
      positive: ButtonType;
      neutral: ButtonType;
      negative: ButtonType;
    };
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
    style?: StyleProp<ViewStyle>;
  }
>;
