/**
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Platform} from 'react-native';

import type {BaseProps} from './types';

export default function DateTimePicker(_props: BaseProps): null {
  React.useEffect(() => {
    console.warn(`DateTimePicker is not supported on: ${Platform.OS}`);
  }, []);
  return null;
}
