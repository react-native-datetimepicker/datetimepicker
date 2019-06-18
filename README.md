# React Native DateTimePicker

[![CircleCI Status](https://img.shields.io/circleci/project/github/react-native-community/react-native-datetimepicker/master.svg)](https://circleci.com/gh/react-native-community/workflows/react-native-datetimepicker/tree/master) ![Supports Android and iOS](https://img.shields.io/badge/platforms-android%20|%20ios-lightgrey.svg) ![MIT License](https://img.shields.io/npm/l/@react-native-community/slider.svg)

React Native date & time picker component for iOS and Android

#### iOS

<table>
  <tr><td><strong>iOS</strong></td></tr>
  <tr>
    <td><img src="./docs/images/ios_date.png" width="260" height="420"/></td>
    <td><img src="./docs/images/ios_time.png" width="260" height="420"/></td>
  </tr>
  <tr><td><strong>Android</strong></td></tr>
  <tr>
    <td><img src="./docs/images/android_date.png"/></td>
    <td><img src="./docs/images/android_time.png"/></td>
  </tr>
</table>

## Table of Contents

- [React Native DateTimePicker](#react-native-datetimepicker)
      - [iOS](#ios)
      - [Android](#android)
  - [Getting started](#getting-started)
    - [Install using react-native link](#install-using-react-native-link)
    - [Manual installation](#manual-installation)
      - [iOS](#ios-1)
      - [Android](#android-1)
  - [General Usage](#general-usage)
    - [Importing it](#importing-it)
    - [Basic usage with state](#basic-usage-with-state)
  - [Props](#props)
    - [`mode` (`optional`)](#mode-optional)
    - [`display` (`optional`, `Android only`)](#display-optional-android-only)
    - [`onChange` (`optional`)](#onchange-optional)
    - [`value` (`required`)](#value-required)
    - [`maximumDate` (`optional`)](#maximumdate-optional)
    - [`minimumDate` (`optional`)](#minimumdate-optional)
    - [`timeZoneOffsetInMinutes` (`optional`, `iOS only`)](#timezoneoffsetinminutes-optional-ios-only)
    - [`locale` (`optional`, `iOS only`)](#locale-optional-ios-only)
    - [`is24Hour` (`optional`, `Android only`)](#is24hour-optional-android-only)
    - [`minuteInterval` (`optional`, `iOS only`)](#minuteinterval-optional-ios-only)
  - [Migration from the older components](#migration-from-the-older-components)
    - [DatePickerIOS](#datepickerios)
    - [DatePickerAndroid](#datepickerandroid)
    - [TimePickerAndroid](#timepickerandroid)
  - [Contributing to the component](#contributing-to-the-component)
    - [Clone, install](#clone-install)
    - [Tests](#tests)
      - [Jest](#jest)
      - [Detox](#detox)
        - [iOS](#ios-2)
        - [Android](#android-2)
    - [Running the example app](#running-the-example-app)

## Getting started

```bash
npm install @react-native-community/datetimepicker --save
```

or

```bash
yarn add @react-native-community/datetimepicker
```


### Install using react-native link

```bash
react-native link @react-native-community/datetimepicker
```

### Manual installation

#### iOS

- Linking project manually:

  1. In XCode's "Project navigator", right click on your project's Libraries folder ➜ `Add Files to <...>`.
  2. Go to `node_modules` ➜ `@react-native-community/datetimepicker` ➜ `ios` ➜ select `RNDateTimePicker.xcodeproj`.
  3. Add `libRNDateTimePicker.a` to `Build Phases -> Link Binary With Libraries`.

- Using CocoaPods:

  1. Install CocoaPods, here the [installation guide](https://guides.cocoapods.org/using/getting-started.html).
  2. Inside the iOS folder run `pod init`, this will create the initial `pod` file.
  3. Update your `pod` file to look like the following ( Remember to replace `MyApp` with your target name ):

      ```ruby
      # Allowed sources
      source 'https://github.com/CocoaPods/Specs.git'

      target 'MyApp' do
        # As we use Swift, ensure that `use_frameworks` is enabled.
        use_frameworks!

        # Specific iOS platform we are targetting
        platform :ios, '8.0'

        # Point to the installed version
        pod 'RNDateTimePicker', :path => '../node_modules/@react-native-community/datetimepicker/RNDateTimePicker.podspec'

        # React/React-Native specific pods
        pod 'React', :path => '../node_modules/react-native', :subspecs => [
          'Core',
          'CxxBridge',      # Include this for RN >= 0.47
          'DevSupport',     # Include this to enable In-App Devmenu if RN >= 0.43
          'RCTText',
          'RCTNetwork',
          'RCTWebSocket',   # Needed for debugging
        ]

        # Explicitly include Yoga if you are using RN >= 0.42.0
        pod 'yoga', :path => '../node_modules/react-native/ReactCommon/yoga'

        # Third party deps podspec link
        pod 'DoubleConversion', :podspec => '../node_modules/react-native/third-party-podspecs/DoubleConversion.podspec'
        pod 'glog', :podspec => '../node_modules/react-native/third-party-podspecs/glog.podspec'
        pod 'Folly', :podspec => '../node_modules/react-native/third-party-podspecs/Folly.podspec'

      end
      ```
  4. Run `pod install` inside the same folder where the `pod` file was created
  5. `npm run start`
  6. `npm run start:ios`

#### Android

1. Add the following lines to `android/settings.gradle`:

   ```gradle
   include ':react-native-datetimepicker'
   project(':react-native-datetimepicker').projectDir = new File(rootProject.projectDir, '../node_modules/@react-native-community/datetimepicker/android')
   ```

2. Add into `android/gradle.properties`:

   ```gradle
   android.useAndroidX=true
   android.enableJetifier=true
   ```

3. Add the compile line to the dependencies in `android/app/build.gradle`:

   ```gradle
   dependencies {
       ...
       implementation project(':react-native-datetimepicker')
   }
   ```

4. Add the import and link the package in `MainApplication.java`:

   ```diff
   + import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;

   public class MainApplication extends Application implements ReactApplication {
       @Override
       protected List<ReactPackage> getPackages() {
           return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
   +             new RNDateTimePickerPackage()
           );
       }
   }
   ```

## General Usage

### Importing it

```js
import DateTimePicker from '@react-native-community/datetimepicker';
```
or

```js
var DateTimePicker = require('@react-native-community/datetimepicker');
```

### Basic usage with state

```js
import React, {Component} from 'react';
import {View, Button, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default class App extends Component {
  state = {
    date: new Date('2020-06-12T14:42:42'),
    mode: 'date',
    show: false,
  }

  setDate = (event, date) => {
    date = date || this.state.date;

    this.setState({
      show: Platform.OS === 'ios' ? true : false,
      date,
    });
  }

  show = mode => {
    this.setState({
      show: true,
      mode,
    });
  }

  datepicker = () => {
    this.show('date');
  }

  timepicker = () => {
    this.show('time');
  }

  render() {
    const { show, date, mode } = this.state;

    return (
      <View>
        <View>
          <Button onPress={this.datepicker} title="Show date picker!" />
        </View>
        <View>
          <Button onPress={this.timepicker} title="Show time picker!" />
        </View>
        { show && <DateTimePicker value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={this.setDate} />
        }
      </View>
    );
  }
}
```

## Props

### `mode` (`optional`)

Defines the type of the picker.

List of possible values:
- `"date"` (default for `iOS` and `Android)
- `"time"`
- `"datetime"` (`iOS` only)
- `"countdown"` (`iOS` only)

```js
<RNDateTimePicker mode="time" />
```

### `display` (`optional`, `Android only`)

Defines the visual display of the picker for Android and will be ignored for iOS.

List of possible values:
- `"default"`
- `"spinner"`
- `"calendar"` (only for `date` mode)
- `"clock"` (only for `time` mode)

```js
<RNDateTimePicker display="spinner" } />
```

### `onChange` (`optional`)

Date change handler.

This is called when the user changes the date or time in the UI. It receives the event and the date as parameters.

```js
setDate = (event, date) => {}

<RNDateTimePicker onChange={this.setDate} />
```

### `value` (`required`)

Defines the date or time value used in the component.

```js
<RNDateTimePicker value={new Date()} />
```

### `maximumDate` (`optional`)

Defines the maximum date that can be selected.

```js
<RNDateTimePicker maximumDate={new Date(2300, 10, 20)} />
```

### `minimumDate` (`optional`)

Defines the minimum date that can be selected.

```js
<RNDateTimePicker minimumDate={new Date(1950, 0, 1)} />
```

### `timeZoneOffsetInMinutes` (`optional`, `iOS only`)

Allows changing of the timeZone of the date picker. By default it uses the device's time zone.

```js
// GMT+1
<RNDateTimePicker timeZoneOffsetInMinutes={60} />
```

### `locale` (`optional`, `iOS only`)

Allows changing of the locale of the component. By default it uses the device's locale.

```js
<RNDateTimePicker locale="es-ES" />
```

### `is24Hour` (`optional`, `Android only`)

Allows changing of the time picker to a 24 hour format.

```js
<RNDateTimePicker is24Hour={true} />
```

### `minuteInterval` (`optional`, `iOS only`)

The interval at which minutes can be selected.
Possible values are: `1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30`

```js
<RNDateTimePicker minuteInterval={10} />
```

## Migration from the older components

`RNDateTimePicker` is the new common name used to represent the old versions of iOS and Android.

On Android, open picker modals will update the selected date and/or time if the prop `value` changes. For example, if a HOC holding state, updates the `value` prop. Previously the component used to close the modal and render a new one on consecutive calls.

### DatePickerIOS

-  `initialDate` is deprecated, use `value` instead.

    ```js
    // Before
    <DatePickerIOS initialValue={new Date()} />
    ```

    ```js
    // Now
    <RNDateTimePicker value={new Date()} />
    ```

- `date` is deprecated, use `value` instead.

    ```js
    // Before
    <DatePickerIOS date={new Date()} />
    ```

    ```js
    // Now
    <RNDateTimePicker value={new Date()} />
    ```

- `onChange` now returns also the date.

    ```js
    // Before
    onChange = (event) => {}
    <DatePickerIOS onChange={this.onChange} />
    ```

    ```js
    // Now
    onChange = (event, date) => {}
    <RNDateTimePicker onChange={this.onChange} />
    ```

- `onDateChange` is deprecated, use `onChange` instead.

    ```js
    // Before
    setDate = (date) => {}
    <DatePickerIOS onDateChange={this.setDate} />
    ```

    ```js
    // Now
    setDate = (event, date) => {}
    <RNDateTimePicker onChange={this.setDate} />
    ```

### DatePickerAndroid

- `date` is deprecated, use `value` instead.

    ```js
    // Before
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: new Date()
      });
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
    ```

    ```js
    // Now
    <RNDateTimePicker mode="date" value={new Date()} />
    ```

- `minDate` and `maxDate` are deprecated, use `minimumDate` and `maximumDate` instead.

    ```js
    // Before
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        minDate: new Date(),
        maxDate: new Date()
      });
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
    ```

    ```js
    // Now
    <RNDateTimePicker mode="date" minimumDate={new Date()} maximumDate={new Date()} />
    ```

- `dateSetAction` is deprecated, use `onChange` instead.

    ```js
    // Before
    try {
      const {action, year, month, day} = await DatePickerAndroid.open();
      if (action === DatePickerAndroid.dateSetAction) {
        // Selected year, month (0-11), day
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
    ```

    ```js
    // Now
    setDate = (event, date) => {
      if (date !== undefined) {
        // timeSetAction
      }
    }
    <RNDateTimePicker mode="date" onChange={this.setDate} />
    ```

- `dismissedAction` is deprecated, use `onChange` instead.

    ```js
    // Before
    try {
      const {action, year, month, day} = await DatePickerAndroid.open();
      if (action === DatePickerAndroid.dismissedAction) {
        // Dismissed
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
    ```

    ```js
    // Now
    setDate = (event, date) => {
      if (date === undefined) {
        // dismissedAction
      }
    }
    <RNDateTimePicker mode="date" onChange={this.setDate} />
    ```

### TimePickerAndroid

- `hour` and `minute` are deprecated, use `value` instead.

    ```js
    // Before
    try {
      const {action, hour, minute} = await TimePickerAndroid.open({
        hour: 14,
        minute: 0,
        is24Hour: false, // Will display '2 PM'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        // Selected hour (0-23), minute (0-59)
      }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }
    ```

    ```js
    // Now
    // It will use the hour and minute defined in date
    <RNDateTimePicker mode="time" value={new Date()} />
    ```

- `timeSetAction` is deprecated, use `onChange` instead.

    ```js
    // Before
    try {
      const {action, hour, minute} = await TimePickerAndroid.open();
      if (action === TimePickerAndroid.timeSetAction) {
        // Selected hour (0-23), minute (0-59)
      }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }
    ```

    ```js
    // Now
    setTime = (event, date) => {
      if (date !== undefined) {
        // Use the hour and minute from the date object
      }
    }
    <RNDateTimePicker mode="time" onChange={this.setTime} />
    ```

- `dismissedAction` is deprecated, use `onChange` instead.

    ```js
    // Before
    try {
      const {action, hour, minute} = await TimePickerAndroid.open();
      if (action === TimePickerAndroid.dismissedAction) {
        // Dismissed
      }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }
    ```

    ```js
    // Now
    setTime = (event, date) => {
      if (date === undefined) {
        // dismissedAction
      }
    }
    <RNDateTimePicker mode="time" onChange={this.setTime} />
    ```

## Contributing to the component

### Clone, install

```sh
git clone https://github.com/react-native-community/react-native-datetimepicker.git
cd react-native-datetimepicker
npm install
```

### Tests

#### Jest

```sh
npm install
npm run test
```

#### Detox

Detox is a gray box end-to-end testing and automation library for mobile apps.
- [Dependencies required](https://github.com/wix/Detox/blob/master/docs/Introduction.GettingStarted.md#step-1-install-dependencies)

For cleaning all the detox builds just run `npm run detox:clean`.

##### iOS

- debug:
  ```sh
  # Debug requires to run Metro Bundler
  npm run start
  npm run detox:ios:build:debug
  npm run detox:ios:test:debug
  ```

- release:

  ```sh
  npm run detox:ios:build:release
  npm run detox:ios:test:release
  ```

##### Android

  An existing Android emulator is required to match the name defined in `detox.configurations.android.emu.debug.name` and `detox.configurations.android.emu.release.name` inside the `package.json`.

  - debug:
    ```sh
    # Debug requires to run Metro Bundler
    npm run start
    npm run detox:android:build:debug
    npm run detox:android:test:debug
    ```

  - release:

    ```sh
    npm run detox:android:build:release
    npm run detox:android:test:release
    ```

### Running the example app

1. Run `npm run start` for starting Metro Bundler
2. Run `npm run start:ios` or `npm run start:android`
