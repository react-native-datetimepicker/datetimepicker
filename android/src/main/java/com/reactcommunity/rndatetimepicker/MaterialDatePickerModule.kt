package com.reactcommunity.rndatetimepicker

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap

class MaterialDatePickerModule(reactContext: ReactApplicationContext): NativeModuleMaterialDatePickerSpec(reactContext) {
  companion object {
    const val NAME = "RNCMaterialDatePicker"
  }

  override fun getName(): String {
    return NAME
  }

  override fun dismiss(promise: Promise?) {
  }

  override fun open(params: ReadableMap, promise: Promise) {
  }
}
