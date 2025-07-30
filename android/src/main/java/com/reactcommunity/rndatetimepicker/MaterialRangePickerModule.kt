package com.reactcommunity.rndatetimepicker

import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.UiThreadUtil
import com.reactcommunity.rndatetimepicker.Common.createDatePickerArguments
import com.reactcommunity.rndatetimepicker.Common.createRangePickerArguments
import com.reactcommunity.rndatetimepicker.Common.dismissDialog

class MaterialRangePickerModule(reactContext: ReactApplicationContext): NativeModuleMaterialRangePickerSpec(reactContext) {
  companion object {
    const val NAME = "RNCMaterialRangePicker"
  }

  override fun getName(): String {
    return NAME
  }

  override fun dismiss(promise: Promise?) {
    val activity = currentActivity as FragmentActivity?
    dismissDialog(activity, NAME, promise)
  }

  override fun open(params: ReadableMap, promise: Promise) {
    val activity = currentActivity as FragmentActivity?
    if (activity == null) {
      promise.reject(
        RNConstants.ERROR_NO_ACTIVITY,
        "Tried to open a MaterialRangePicker dialog while not attached to an Activity"
      )
      return
    }

    val fragmentManager = activity.supportFragmentManager

    UiThreadUtil.runOnUiThread {
      val arguments = createRangePickerArguments(params)
      val rangePicker =
        RNMaterialRangePicker(arguments, promise, fragmentManager, reactApplicationContext)
      rangePicker.open()
    }
  }
}
