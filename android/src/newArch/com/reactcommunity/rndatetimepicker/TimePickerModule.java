package com.reactcommunity.rndatetimepicker;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;

public class TimePickerModule extends NativeModuleTimePickerSpec {
  private TimePickerModuleImpl impl;

  public TimePickerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.impl = new TimePickerModuleImpl(reactContext);
  }

  @Override
  public void dismiss(Promise promise) {
    impl.dismiss(promise);
  }

  @Override
  public void open(ReadableMap params, Promise promise) {
    impl.open(params, promise);
  }

  @NonNull
  @Override
  public String getName() {
    return TimePickerModuleImpl.NAME;
  }
}
