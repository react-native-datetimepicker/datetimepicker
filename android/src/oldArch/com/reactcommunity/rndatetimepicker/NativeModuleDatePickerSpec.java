package com.reactcommunity.rndatetimepicker;

import com.facebook.proguard.annotations.DoNotStrip;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactModuleWithSpec;
import com.facebook.react.bridge.ReadableMap;

public abstract class NativeModuleDatePickerSpec extends ReactContextBaseJavaModule implements ReactModuleWithSpec {
  public NativeModuleDatePickerSpec(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @ReactMethod
  @DoNotStrip
  public abstract void dismiss(Promise promise);

  @ReactMethod
  @DoNotStrip
  public abstract void open(ReadableMap params, Promise promise);
}
