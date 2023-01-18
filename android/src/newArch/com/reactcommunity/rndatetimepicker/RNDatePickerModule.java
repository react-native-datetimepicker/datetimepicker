package com.reactcommunity.rndatetimepicker;


import androidx.annotation.NonNull;

import com.facebook.fbreact.specs.NativeDatePickerAndroidSpec;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;

public class RNDatePickerModule extends NativeDatePickerAndroidSpec {

  public RNDatePickerModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @NonNull
  @Override
  public String getName() {
    return null;
  }

  @Override
  public void open(ReadableMap readableMap, Promise promise) {

  }

}
