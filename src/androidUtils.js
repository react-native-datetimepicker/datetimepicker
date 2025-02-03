/**
 * @format
 * @flow strict-local
 */
import {ANDROID_DISPLAY, ANDROID_MODE} from './constants';
import defaultPickers from './picker';
import type {AndroidNativeProps, DateTimePickerResult} from './types';
import {sharedPropsValidation} from './utils';
import invariant from 'invariant';
import {processColor} from 'react-native';
import MaterialDatePickerAndroid from './materialdatepicker';
import MaterialTimePickerAndroid from './materialtimepicker';

type Timestamp = number;

type ProcessedButton = {
  title: string,
  textColor: $Call<typeof processColor>,
};

type OpenParams = {
  value: Timestamp,
  display: AndroidNativeProps['display'],
  is24Hour: AndroidNativeProps['is24Hour'],
  minimumDate: AndroidNativeProps['minimumDate'],
  maximumDate: AndroidNativeProps['maximumDate'],
  minuteInterval: AndroidNativeProps['minuteInterval'],
  timeZoneOffsetInMinutes: AndroidNativeProps['timeZoneOffsetInMinutes'],
  timeZoneName: AndroidNativeProps['timeZoneName'],
  testID: AndroidNativeProps['testID'],
  firstDayOfWeek: AndroidNativeProps['firstDayOfWeek'],
  dialogButtons: {
    positive: ProcessedButton,
    negative: ProcessedButton,
    neutral: ProcessedButton,
  },
  initialInputMode: AndroidNativeProps['initialInputMode'],
  title: AndroidNativeProps['title'],
  design: AndroidNativeProps['design'],
  fullscreen: AndroidNativeProps['fullscreen'],
};

export type PresentPickerCallback =
  (OpenParams) => Promise<DateTimePickerResult>;

function getOpenPicker(
  mode: AndroidNativeProps['mode'],
  design: AndroidNativeProps['design'],
): PresentPickerCallback {
  const pickers = design === 'material' ? materialPickers : defaultPickers;

  switch (mode) {
    case ANDROID_MODE.time:
      return ({
        value,
        display,
        is24Hour,
        minuteInterval,
        timeZoneOffsetInMinutes,
        timeZoneName,
        dialogButtons,
        title,
        initialInputMode,
      }: OpenParams) =>
        // $FlowFixMe - `AbstractComponent` [1] is not an instance type.
        pickers[mode].open({
          value,
          display,
          minuteInterval,
          is24Hour,
          timeZoneOffsetInMinutes,
          timeZoneName,
          dialogButtons,
          title,
          initialInputMode,
        });
    default:
      return ({
        value,
        display,
        minimumDate,
        maximumDate,
        timeZoneOffsetInMinutes,
        timeZoneName,
        dialogButtons,
        testID,
        firstDayOfWeek,
        title,
        initialInputMode,
        fullscreen,
      }: OpenParams) =>
        // $FlowFixMe - `AbstractComponent` [1] is not an instance type.
        pickers[ANDROID_MODE.date].open({
          value,
          display,
          minimumDate,
          maximumDate,
          timeZoneOffsetInMinutes,
          timeZoneName,
          dialogButtons,
          testID,
          firstDayOfWeek,
          title,
          initialInputMode,
          fullscreen,
        });
  }
}

function validateAndroidProps(props: AndroidNativeProps) {
  sharedPropsValidation({value: props?.value});

  if (props.design !== 'material') validateMaterial3PropsNotUsed(props);

  const {mode, display} = props;
  invariant(
    !(display === ANDROID_DISPLAY.calendar && mode === ANDROID_MODE.time) &&
      !(display === ANDROID_DISPLAY.clock && mode === ANDROID_MODE.date),
    `display: ${display} and mode: ${mode} cannot be used together.`,
  );
  if (
    props?.positiveButtonLabel !== undefined ||
    props?.negativeButtonLabel !== undefined ||
    props?.neutralButtonLabel !== undefined
  ) {
    console.warn(
      'positiveButtonLabel, negativeButtonLabel and neutralButtonLabel are deprecated.' +
        'Use positive / negative / neutralButton prop instead.',
    );
  }
}

function validateMaterial3PropsNotUsed(props: AndroidNativeProps) {
  if (props.initialInputMode)
    console.warn('initialInputMode prop is not supported in default pickers.');

  if (props.title !== undefined)
    console.warn('title prop is not supported in default pickers.');

  if (props.fullscreen !== undefined)
    console.warn('fullscreen prop is not supported in default pickers.');
}

const materialPickers: {
  date: typeof MaterialDatePickerAndroid,
  time: typeof MaterialTimePickerAndroid,
  ...
} = {
  [ANDROID_MODE.date]: MaterialDatePickerAndroid,
  [ANDROID_MODE.time]: MaterialTimePickerAndroid,
};

export {getOpenPicker, validateAndroidProps, materialPickers};
