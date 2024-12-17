package com.reactcommunity.rndatetimepicker

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap

class MaterialRangePickerModule(reactContext: ReactApplicationContext): NativeModuleMaterialRangePickerSpec(reactContext) {
  companion object {
    const val NAME = "RNCMaterialRangePicker"
  }

  override fun getName(): String {
    return NAME
  }

  override fun dismiss(promise: Promise?) {
  }

  override fun open(params: ReadableMap, promise: Promise) {
  }
}
