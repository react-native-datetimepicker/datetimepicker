package com.reactcommunity.rndatetimepicker

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap

class MaterialTimePickerModule(reactContext: ReactApplicationContext) :
  NativeModuleMaterialTimePickerSpec(reactContext) {
  companion object {
    const val NAME = "RNCMaterialTimePicker"
  }

  override fun getName(): String {
    return NAME
  }

  override fun dismiss(promise: Promise?) {
  }

  override fun open(params: ReadableMap, promise: Promise) {
  }
}
