import {NativeModules} from 'react-native';
NativeModules.RNDateTimePickerManager = {};

NativeModules.RNDateTimePickerManager.measure = jest.fn(() =>
  Promise.resolve({
    autoHeightForDatePicker: 216,
    autoHeightForTimePicker: 216,
  }),
);
