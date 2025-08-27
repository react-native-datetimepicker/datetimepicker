package com.reactcommunity.rndatetimepicker

import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.UiThreadUtil
import com.reactcommunity.rndatetimepicker.Common.createTimePickerArguments
import com.reactcommunity.rndatetimepicker.Common.dismissDialog

class MaterialTimePickerModule(reactContext: ReactApplicationContext) :
  NativeModuleMaterialTimePickerSpec(reactContext) {
  companion object {
    const val NAME = "RNCMaterialTimePicker"
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
        "Tried to open a MaterialTimePicker dialog while not attached to an Activity"
      )
    }

    val fragmentManager = activity!!.supportFragmentManager

    UiThreadUtil.runOnUiThread {
      val arguments =
        createTimePickerArguments(params)
      val materialPicker = RNMaterialTimePicker(
        arguments,
        promise,
        fragmentManager,
        reactApplicationContext
      )
      materialPicker.open()
    }
  }
}
