import {NativeModules} from 'react-native';
NativeModules.RNDateTimePickerManager = {
  getDefaultDisplayValue: jest.fn(() =>
    Promise.resolve({
      determinedDisplayValue: 'spinner',
    }),
  ),
};
