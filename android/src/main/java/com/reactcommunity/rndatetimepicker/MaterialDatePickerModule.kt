package com.reactcommunity.rndatetimepicker

import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.UiThreadUtil
import com.reactcommunity.rndatetimepicker.Common.createDatePickerArguments
import com.reactcommunity.rndatetimepicker.Common.dismissDialog

class MaterialDatePickerModule(reactContext: ReactApplicationContext): NativeModuleMaterialDatePickerSpec(reactContext) {
  companion object {
    const val NAME = "RNCMaterialDatePicker"
  }

  override fun getName(): String {
    return NAME
  }

  override fun dismiss(promise: Promise?) {
    val activity = reactApplicationContext.currentActivity as FragmentActivity?
    dismissDialog(activity, NAME, promise)
  }

  override fun open(params: ReadableMap, promise: Promise) {
    val activity = reactApplicationContext.currentActivity as FragmentActivity?
    if (activity == null) {
      promise.reject(
        RNConstants.ERROR_NO_ACTIVITY,
        "Tried to open a MaterialDatePicker dialog while not attached to an Activity"
      )
      return
    }

    val fragmentManager = activity.supportFragmentManager

    UiThreadUtil.runOnUiThread {
      val arguments = createDatePickerArguments(params)
      val datePicker =
        RNMaterialDatePicker(arguments, promise, fragmentManager, reactApplicationContext)
      datePicker.open()
    }
  }
}
