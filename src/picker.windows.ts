/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {requireNativeComponent} from 'react-native';

export default requireNativeComponent(
  'RNDateTimePickerWindows',
  // FIXME: Unclear type. Using `any`, `Object`, or `Function` types is not safe!
) as any;
