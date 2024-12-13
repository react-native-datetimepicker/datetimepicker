import {FC, Ref, SyntheticEvent} from 'react';
import {ColorValue, NativeMethods, ViewProps} from 'react-native';

type IOSMode = 'date' | 'time' | 'datetime' | 'countdown';
type AndroidMode = 'date' | 'time';
type Display = 'spinner' | 'default' | 'clock' | 'calendar';
type IOSDisplay = 'default' | 'compact' | 'inline' | 'spinner';
type MinuteInterval = 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30;
type Design = 'default' | 'material';
type InputMode = 'default' | 'keyboard';
type DAY_OF_WEEK = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Event = SyntheticEvent<
  Readonly<{
    timestamp: number;
  }>
>;

export type EvtTypes = 'set' | 'neutralButtonPressed' | 'dismissed';

export type DateTimePickerEvent = {
  type: EvtTypes;
  nativeEvent: {
    timestamp: number;
    utcOffset: number;
  };
};

type BaseOptions = {
  /**
   * The currently selected date.
   */
  value: Date;

  /**
   * Date change handler.
   *
   * This is called when the user changes the date or time in the UI.
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

export type BaseProps = Readonly<
  Omit<ViewProps, 'children'> &
    DateOptions & {
      /**
       * The tz database name in https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
       */
      timeZoneName?: string;
    }
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
    textColor?: string;

    /**
     * The date picker accent color.
     *
     * Sets the color of the selected, date and navigation icons.
     * Has no effect for display 'spinner'.
     */
    accentColor?: string;

    /**
     * Override theme variant used by iOS native picker
     */
    themeVariant?: 'dark' | 'light';

    /**
     * Sets the preferredDatePickerStyle for picker
     */
    display?: IOSDisplay;

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
      mode?: AndroidMode;

      /**
       * The display options.
       *
       * Not supported for Material 3 pickers
       */
      display?: Display;

      /**
       * The interval at which minutes can be selected.
       *
       * Not supported for Material 3 pickers
       */
      minuteInterval?: MinuteInterval;

      positiveButton?: ButtonType;

      /**
       * Not supported for Material 3 pickers
       */
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
      /**
       * Sets the first day of the week shown in the calendar
       */
      firstDayOfWeek?: DAY_OF_WEEK;
      /**
       * callback when an error occurs inside the date picker native code (such as null activity)
       */
      onError?: (_arg: Error) => void;
      /**
       * (Material 3 only) The initial input mode when the dialog opens.
       *
       * If not provided, a calendar is initially shown for the date picker and a clock for the time picker.
       */
      initialInputMode?: InputMode;
      /**
       * (Material 3 only) The title of the dialog
       */
      title?: string;
      /**
       * (Material 3 only) Controls if the date picker should be shown as fullscreen dialog
       */
      fullscreen?: boolean;
      /**
       * Use Material 3 pickers or the default ones
       */
      design?: Design;
    }
>;

export type DatePickerOptions = DateOptions & {
  display?: Display;
};

export type TimePickerOptions = TimeOptions & {
  display?: Display;
};

export type RCTDateTimePickerNative = NativeMethods;
export type NativeRef = {
  current: Ref<RCTDateTimePickerNative> | null;
};

export type WindowsNativeProps = Readonly<
  BaseProps &
    DateOptions &
    TimeOptions & {
      /**
       * The display options.
       */
      display?: Display;

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
      firstDayOfWeek?: DAY_OF_WEEK;
      timeZoneOffsetInSeconds?: number;
      is24Hour?: boolean;
      minuteInterval?: number;
      accessibilityLabel?: string;
    }
>;

declare namespace DateTimePickerAndroidType {
  const open: (args: AndroidNativeProps) => void;
  const dismiss: (mode: AndroidNativeProps['mode']) => Promise<boolean>;
}

declare const RNDateTimePicker: FC<
  IOSNativeProps | AndroidNativeProps | WindowsNativeProps
>;

export default RNDateTimePicker;
export const DateTimePickerAndroid: typeof DateTimePickerAndroidType;
