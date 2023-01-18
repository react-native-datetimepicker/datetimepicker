package com.reactcommunity.rndatetimepicker;


import androidx.annotation.NonNull;

import com.facebook.fbreact.specs.NativeDatePickerAndroidSpec;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;

public class DatePickerModule extends NativeModuleDatePickerSpec {
  private DatePickerModuleImpl impl;

  public DatePickerModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.impl = new DatePickerModuleImpl(reactContext);
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
    return DatePickerModuleImpl.NAME;
  }
}
