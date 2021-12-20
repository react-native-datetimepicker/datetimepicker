### 🚧🚧 Looking for collaborators and backers 🚧🚧

See this [issue](https://github.com/react-native-datetimepicker/datetimepicker/issues/313)

### Backers

Support us with a monthly donation and help us continue our activities. [Become a backer on OpenCollective](https://opencollective.com/react-native-datetimepicker) or [sponsor us on GitHub Sponsors](https://github.com/sponsors/react-native-datetimepicker)

<a href="https://opencollective.com/react-native-datetimepicker/donate" target="_blank">
  <img src="https://opencollective.com/react-native-datetimepicker/backers.svg?width=890" width=890 />
</a>

# React Native DateTimePicker

This repository was moved out of the react native community GH organization, in accordance to [this proposal](https://github.com/react-native-community/discussions-and-proposals/issues/176).
The module is still published on `npm` under the old namespace (as documented) but will be published under a new namespace at some point, with a major version bump.

![CircleCI Status][circle-ci-status]
![Supports Android and iOS][support-badge]
![MIT License][license-badge]
[![Lean Core Badge][lean-core-badge]][lean-core-issue]

React Native date & time picker component for iOS, Android and Windows.

<table>
  <tr><td colspan=2><strong>iOS</strong></td></tr>
  <tr>
    <td><p align="center"><img src="./docs/images/ios_date_new.png" height="420"/></p></td>
    <td><p align="center"><img src="./docs/images/ios_time.png" width="260" height="420"/></p></td>
  </tr>
  <tr><td colspan=2><strong>Android</strong></td></tr>
  <tr>
    <td><p align="center"><img src="./docs/images/android_date.png" width="200" height="400"/></p></td>
    <td><p align="center"><img src="./docs/images/android_time.png" width="200" height="400"/></p></td>
  </tr>
  <tr><td colspan=1><strong>Windows</strong></td></tr>
  <tr>
    <td><p align="center"><img src="./docs/images/windows_date.png" width="380" height="430"/></p></td>
    <td><p align="center"><img src="./docs/images/windows_time_2.png" width="380" height="430"/></p></td>
  </tr>
  <tr>
    <td><p align="center"><img src="./docs/images/windows_time_1.png" width="310" height="40"/></p></td>
  </tr>
</table>

## Table of Contents

- [React Native DateTimePicker](#react-native-datetimepicker)
  - [Table of Contents](#table-of-contents)
  - [Expo users notice](#expo-users-notice)
  - [Getting started](#getting-started)
    - [RN >= 0.60](#rn--060)
    - [RN < 0.60](#rn--060-1)
  - [General Usage](#general-usage)
    - [Basic usage with state](#basic-usage-with-state)
  - [Props](#props)
    - [`mode` (`optional`)](#mode-optional)
    - [`display` (`optional`)](#display-optional)
    - [`onChange` (`optional`)](#onchange-optional)
    - [`value` (`required`)](#value-required)
    - [`maximumDate` (`optional`)](#maximumdate-optional)
    - [`minimumDate` (`optional`)](#minimumdate-optional)
    - [`timeZoneOffsetInMinutes` (`optional`, `iOS or Android only`)](#timezoneoffsetinminutes-optional-ios-and-android-only)
    - [`timeZoneOffsetInSeconds` (`optional`, `Windows only`)](#timezoneoffsetinsecond-optional-windows-only)
    - [`dayOfWeekFormat` (`optional`, `Windows only`)](#dayOfWeekFormat-optional-windows-only)
    - [`dateFormat` (`optional`, `Windows only`)](#dateFormat-optional-windows-only)
    - [`firstDayOfWeek` (`optional`, `Windows only`)](#firstDayOfWeek-optional-windows-only)
    - [`textColor` (`optional`, `iOS only`)](#textColor-optional-ios-only)
    - [`themeVariant` (`optional`, `iOS only`)](#themeVariant-optional-ios-only)
    - [`locale` (`optional`, `iOS only`)](#locale-optional-ios-only)
    - [`is24Hour` (`optional`, `Windows and Android only`)](#is24hour-optional-windows-and-android-only)
    - [`neutralButtonLabel` (`optional`, `Android only`)](#neutralbuttonlabel-optional-android-only)
    - [`minuteInterval` (`optional`)](#minuteinterval-optional)
    - [`style` (`optional`, `iOS only`)](#style-optional-ios-only)
    - [`disabled` (`optional`, `iOS only`)](#disabled-optional-ios-only)
  - [Migration from the older components](#migration-from-the-older-components)
    - [DatePickerIOS](#datepickerios)
    - [DatePickerAndroid](#datepickerandroid)
    - [TimePickerAndroid](#timepickerandroid)
  - [Contributing to the component](#contributing-to-the-component)
  - [Manual installation](#manual-installation)
    - [iOS](#ios)
    - [Android](#android)
    - [Windows](#windows)
  - [Running the example app](#running-the-example-app)

## Requirements

- Only Android API level >=21 (Android 5), iOS >= 11 are supported.
- Tested with Xcode 13.0 and RN 0.66.3. Other configurations are very likely to work as well but have not been tested.

## Expo users notice

This module is part of Expo - [see docs](https://docs.expo.io/versions/latest/sdk/date-time-picker/). However, Expo SDK may not contain the latest version of the module and therefore, the newest features and bugfixes may not be available in Expo. Use the command `expo install @react-native-community/datetimepicker` (not `yarn` or `npm`) to install this module - Expo will automatically install the latest version compatible with your Expo SDK (which may _not_ be the latest version of the module available).

## Getting started

```bash
npm install @react-native-community/datetimepicker --save
```

or

```bash
yarn add @react-native-community/datetimepicker
```

Autolinking is not yet implemented on Windows, so [manual installation ](/docs/manual-installation.md) is needed.

#### RN >= 0.60

If you are using RN >= 0.60, only run `npx pod-install`. Then rebuild your project.

## General Usage

```js
import DateTimePicker from '@react-native-community/datetimepicker';
```

or

```js
const DateTimePicker = require('@react-native-community/datetimepicker');
```

### Basic usage with state

```js
import React, {useState} from 'react';
import {View, Button, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export const App = () => {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View>
      <View>
        <Button onPress={showDatepicker} title="Show date picker!" />
      </View>
      <View>
        <Button onPress={showTimepicker} title="Show time picker!" />
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};
```

## Localization note

On Android, the picker will be controlled by the system locale. If you wish to change it, [see instructions here](https://stackoverflow.com/a/2900144/2070942).

On iOS, the locale can be controlled from xCode, as [documented here](https://developer.apple.com/documentation/xcode/adding-support-for-languages-and-regions).

There is also the iOS-only locale prop that can be used to force locale in some cases but its usage is discouraged due to [not working robustly in all picker modes](./docs/images/ios_date_new.png) (note the mixed month and day names).

For Expo, follow the [localization docs](https://docs.expo.dev/distribution/app-stores/#localizing-your-ios-app).

## Props

> Please note that this library currently exposes functionality from [`UIDatePicker`](https://developer.apple.com/documentation/uikit/uidatepicker?language=objc) on iOS and [DatePickerDialog](https://developer.android.com/reference/android/app/DatePickerDialog) + [TimePickerDialog](https://developer.android.com/reference/android/app/TimePickerDialog) on Android, and [`CalendarDatePicker`](https://docs.microsoft.com/en-us/windows/uwp/design/controls-and-patterns/calendar-date-picker) +[TimePicker](https://docs.microsoft.com/en-us/uwp/api/windows.ui.xaml.controls.timepicker?view=winrt-19041) on Windows.
>
> These native classes offer only limited configuration, while there are dozens of possible options you as a developer may need. It follows that if your requirement is not supported by the backing native views, this library will _not_ be able to implement your requirement. When you open an issue with a feature request, please document if (or how) the feature can be implemented using the aforementioned native views. If those views do not support what you need, such feature requests will be closed as not actionable.

#### `mode` (`optional`)

Defines the type of the picker.

List of possible values:

- `"date"` (default for `iOS` and `Android` and `Windows`)
- `"time"`
- `"datetime"` (`iOS` only)
- `"countdown"` (`iOS` only)

```js
<RNDateTimePicker mode="time" />
```

#### `display` (`optional`)

Defines the visual display of the picker. The default value is `"default"`.

List of possible values for Android

- `"default"` - Show a default date picker (spinner/calendar/clock) based on `mode` and Android version.
- `"spinner"`
- `"calendar"` (only for `date` mode)
- `"clock"` (only for `time` mode)

List of possible values for iOS (maps to [preferredDatePickerStyle](https://developer.apple.com/documentation/uikit/uidatepicker/3526124-preferreddatepickerstyle?changes=latest_minor&language=objc))

- `"default"` - Automatically pick the best style available for the current platform & mode.
- `"spinner"` - the usual appearance with a wheel from which you choose values
- `"compact"` - Affects only iOS 14 and later. Will fall back to "spinner" if not supported.
- `"inline"` - Affects only iOS 14 and later. Will fall back to "spinner" if not supported.

```js
<RNDateTimePicker display="spinner" />
```

#### `onChange` (`optional`)

Date change handler.

This is called when the user changes the date or time in the UI. It receives the event and the date as parameters.

```js
setDate = (event, date) => {};

<RNDateTimePicker onChange={this.setDate} />;
```

#### `value` (`required`)

Defines the date or time value used in the component.

```js
<RNDateTimePicker value={new Date()} />
```

#### `maximumDate` (`optional`)

Defines the maximum date that can be selected. Note that on Android, this only works for `date` mode because [TimePicker](https://developer.android.com/reference/android/widget/TimePicker) does not support this.

```js
<RNDateTimePicker maximumDate={new Date(2300, 10, 20)} />
```

#### `minimumDate` (`optional`)

Defines the minimum date that can be selected. Note that on Android, this only works for `date` mode because [TimePicker](https://developer.android.com/reference/android/widget/TimePicker) does not support this.

```js
<RNDateTimePicker minimumDate={new Date(1950, 0, 1)} />
```

#### `timeZoneOffsetInMinutes` (`optional`, `iOS and Android only`)

Allows changing of the timeZone of the date picker. By default, it uses the device's time zone.
We strongly recommend avoiding this prop on android because of known issues in the implementation (eg. [#528](https://github.com/react-native-datetimepicker/datetimepicker/issues/528)).

```js
// GMT+1
<RNDateTimePicker timeZoneOffsetInMinutes={60} />
```

#### `timeZoneOffsetInSeconds` (`optional`, `Windows only`)

Allows changing of the time zone of the date picker. By default it uses the device's time zone.

```js
// UTC+1
<RNDateTimePicker timeZoneOffsetInSeconds={3600} />
```

#### `dayOfWeekFormat` (`optional`, `Windows only`)

Sets the display format for the day of the week headers.
Reference: https://docs.microsoft.com/en-us/uwp/api/windows.ui.xaml.controls.calendarview.dayofweekformat?view=winrt-18362#remarks

```js
<RNDateTimePicker dayOfWeekFormat={'{dayofweek.abbreviated(2)}'} />
```

#### `dateFormat` (`optional`, `Windows only`)

Sets the display format for the date value in the picker's text box.
Reference: https://docs.microsoft.com/en-us/uwp/api/windows.globalization.datetimeformatting.datetimeformatter?view=winrt-18362#examples

```js
<RNDateTimePicker dateFormat="dayofweek day month" />
```

#### `firstDayOfWeek` (`optional`, `Windows only`)

Indicates which day is shown as the first day of the week.

```js
<RNDateTimePicker firstDayOfWeek={DAY_OF_WEEK.Wednesday} />
// The native parameter type is an enum defined in defined https://docs.microsoft.com/en-us/uwp/api/windows.globalization.dayofweek?view=winrt-18362 - meaning an integer needs to passed here (DAY_OF_WEEK).
```

#### `textColor` (`optional`, `iOS only`)

Allows changing of the textColor of the date picker. Has effect only when `display` is `"spinner"`.

```js
<RNDateTimePicker textColor="red" />
```

#### `locale` (`optional`, `iOS only`)

Allows changing the locale of the component. By default, the device's locale is used. Please note using this prop is discouraged due to not working reliably in all picker modes.
Prefer localization as documented in [Localization note](#localization-note).

```js
<RNDateTimePicker locale="es-ES" />
```

#### `is24Hour` (`optional`, `Windows and Android only`)

Allows changing of the time picker to a 24 hour format. By default, this value is decided automatcially based on the user's chosen locale and other preferences.

```js
<RNDateTimePicker is24Hour={true} />
```

#### `neutralButtonLabel` (`optional`, `Android only`)

Allows displaying neutral button on picker dialog.
Pressing button can be observed in onChange handler as `event.type === 'neutralButtonPressed'`

```js
<RNDateTimePicker neutralButtonLabel="clear" />
```

#### `minuteInterval` (`optional`)

The interval at which minutes can be selected.
Possible values are: `1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30`

(On Windows, this can be any number between 0-59.)

on iOS, this in only supported when `display="spinner"`

```js
<RNDateTimePicker minuteInterval={10} />
```

#### `style` (`optional`, `iOS only`)

Sets style directly on picker component. By default, the picker height is fixed to 216px.

Please note that by default, picker's text color is controlled by the application theme (light / dark mode). In dark mode, text is white and in light mode, text is black.

This means that eg. if the device has dark mode turned on, and your screen background color is white, you will not see the picker. Please use the `Appearance` api to adjust the picker's background color so that it is visible, as we do in the [example App](/example/App.js), use `themeVariant` prop or [opt-out from dark mode](https://stackoverflow.com/a/56546554/2070942).

```js
<RNDateTimePicker style={{flex: 1}} />
```

#### `themeVariant` (`optional`, `iOS only`)

Allows overriding system theme variant (dark or light mode) used by the date picker.

:warning: Has effect only on iOS 14 and later. On iOS 13 & less, use `textColor` to make the picker dark-theme compatible

List of possible values:

- `"light"`
- `"dark"`

```js
<RNDateTimePicker themeVariant="light" />
```

#### `disabled` (`optional`, `iOS only`)

If true, the user won't be able to interact with the view.

## Migration from the older components

Please see [migration.md](/docs/migration.md)

## Contributing to the component

Please see [CONTRIBUTING.md](CONTRIBUTING.md)

## Manual installation

Please see [manual-installation.md](/docs/manual-installation.md)

## Running the example app

1. Run `yarn` in repo root
2. Run `cd example`
3. Install required pods by running `npx pod-install`
4. Run `yarn start` to start Metro Bundler
5. Run `yarn run start:ios` or `yarn run start:android` or `yarn run start:windows`
6. To do any development on the library, open the example project (in the example folder!) in xCode or Android Studio. The example project depends on the library code, which you can edit and observe any changes in the example project.

[circle-ci-badge]: https://img.shields.io/circleci/project/github/react-native-community/datetimepicker/master.svg?style=flat-square
[circle-ci-status]: https://circleci.com/gh/react-native-datetimepicker/datetimepicker.svg?style=svg
[support-badge]: https://img.shields.io/badge/platforms-android%20%7C%20ios%20%7C%20windows-lightgrey.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/@react-native-community/slider.svg?style=flat-square
[lean-core-badge]: https://img.shields.io/badge/Lean%20Core-Extracted-brightgreen.svg?style=flat-square
[lean-core-issue]: https://github.com/facebook/react-native/issues/23313
