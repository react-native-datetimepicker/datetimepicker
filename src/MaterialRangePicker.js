/**
 * @format
 * @flow strict-local
 */
import {Platform} from 'react-native';

const warn = () => {
  console.warn(`MaterialRangePicker is not supported on: ${Platform.OS}`);
};

export const MaterialRangePicker = {open: warn, dismiss: warn};
