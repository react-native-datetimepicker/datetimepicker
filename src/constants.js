/**
 * @format
 * @flow strict-local
 */
export const MIN_MS = 60000;

export const ANDROID_DISPLAY = Object.freeze({
  default: 'default',
  spinner: 'spinner',
  clock: 'clock',
  calendar: 'calendar',
});

export const IOS_DISPLAY = Object.freeze({
  default: 'default',
  spinner: 'spinner',
  compact: 'compact',
  inline: 'inline',
});

export const ANDROID_MODE = Object.freeze({
  date: 'date',
  time: 'time',
});

export const WINDOWS_MODE = ANDROID_MODE;

export const IOS_MODE = Object.freeze({
  ...ANDROID_MODE,
  datetime: 'datetime',
  countdown: 'countdown',
});

export const DAY_OF_WEEK = Object.freeze({
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
});

export const DATE_SET_ACTION = 'dateSetAction';
export const TIME_SET_ACTION = 'timeSetAction';
export const DISMISS_ACTION = 'dismissedAction';

export const NEUTRAL_BUTTON_LABEL = 'neutralButtonLabel';
export const NEUTRAL_BUTTON_ACTION = 'neutralButtonAction';
