/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.reactcommunity.rndatetimepicker;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = TimePickerModuleImpl.NAME)
public class TimePickerModule extends ReactContextBaseJavaModule {
  private TimePickerModuleImpl impl;

  public TimePickerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.impl = new TimePickerModuleImpl(reactContext);
  }

  @ReactMethod
  public void dismiss(Promise promise) {
    impl.dismiss(promise);
  }

  @ReactMethod
  public void open(ReadableMap params, Promise promise) {
    impl.open(params, promise);
  }

  @NonNull
  @Override
  public String getName() {
    return DatePickerModuleImpl.NAME;
  }
}
