/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict-local
 */
import {requireNativeComponent} from 'react-native';

import type {RCTDateTimePickerNative} from './types';

export default ((requireNativeComponent(
  'RNDateTimePicker',
): any): RCTDateTimePickerNative);
