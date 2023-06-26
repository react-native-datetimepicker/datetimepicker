/**
 * @format
 * @flow strict-local
 */
import {Platform} from 'react-native';

const warn = () => {
  console.warn(`DateTimePickerAndroid is not supported on: ${Platform.OS}`);
};

export const DateTimePickerAndroid = {open: warn, dismiss: warn};
