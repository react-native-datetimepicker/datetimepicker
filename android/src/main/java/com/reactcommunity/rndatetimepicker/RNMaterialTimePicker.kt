package com.reactcommunity.rndatetimepicker

import android.content.DialogInterface
import android.os.Bundle
import android.text.format.DateFormat
import android.view.View
import androidx.fragment.app.FragmentManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.google.android.material.timepicker.MaterialTimePicker
import com.google.android.material.timepicker.TimeFormat
import java.util.Calendar

class RNMaterialTimePicker(
  private val args: Bundle,
  private val promise: Promise,
  private val fragmentManager: FragmentManager,
  private val reactContext: ReactApplicationContext
) {
  private var promiseResolved = false
  private var timePicker: MaterialTimePicker? = null
  private var builder = MaterialTimePicker.Builder()

  fun open() {
    createTimePicker()
    addListeners()
    show()
  }

  private fun createTimePicker() {
    setInitialDate()
    setTitle()
    setInputMode()
    setButtons()
    setTimeFormat()

    timePicker = builder.build()
  }

  private fun setInitialDate() {
    val initialDate = RNDate(args)

    builder.setHour(initialDate.hour())
      .setMinute(initialDate.minute())
  }

  private fun setTitle() {
    val title = args.getString(RNConstants.ARG_TITLE)
    if (!title.isNullOrEmpty()) {
      builder.setTitleText(args.getString(RNConstants.ARG_TITLE))
    }
  }

  private fun setInputMode() {
    if (args.getString(RNConstants.ARG_INITIAL_INPUT_MODE).isNullOrEmpty()) {
      builder.setInputMode(MaterialTimePicker.INPUT_MODE_CLOCK)
      return
    }

    val inputMode =
      RNMaterialInputMode.valueOf(
        args.getString(RNConstants.ARG_INITIAL_INPUT_MODE)!!.uppercase()
      )

    if (inputMode == RNMaterialInputMode.KEYBOARD) {
      builder.setInputMode(MaterialTimePicker.INPUT_MODE_KEYBOARD)
    } else {
      builder.setInputMode(MaterialTimePicker.INPUT_MODE_CLOCK)
    }
  }

  private fun setButtons() {
    val buttons = args.getBundle(RNConstants.ARG_DIALOG_BUTTONS) ?: return

    val negativeButton = buttons.getBundle(Common.NEGATIVE)
    val positiveButton = buttons.getBundle(Common.POSITIVE)

    if (negativeButton != null) {
      builder.setNegativeButtonText(negativeButton.getString(Common.LABEL))
    }

    if (positiveButton != null) {
      builder.setPositiveButtonText(positiveButton.getString(Common.LABEL))
    }
  }

  private fun setTimeFormat() {
    if (args.getBoolean(RNConstants.ARG_IS24HOUR)) {
      builder.setTimeFormat(TimeFormat.CLOCK_24H)
      return
    }

    if (DateFormat.is24HourFormat(reactContext)) {
      builder.setTimeFormat(TimeFormat.CLOCK_24H)
    } else {
      builder.setTimeFormat(TimeFormat.CLOCK_12H)
    }
  }

  private fun addListeners() {
    val listeners = Listeners()
    timePicker!!.addOnPositiveButtonClickListener(listeners)
    timePicker!!.addOnDismissListener(listeners)
  }

  private fun show() {
    timePicker!!.show(fragmentManager, MaterialTimePickerModule.NAME)
  }

  private inner class Listeners : View.OnClickListener, DialogInterface.OnDismissListener {
    override fun onDismiss(dialog: DialogInterface) {
      if (promiseResolved || !reactContext.hasActiveReactInstance()) return

      val result: WritableMap = WritableNativeMap()
      result.putString("action", RNConstants.ACTION_DISMISSED)
      promise.resolve(result)
      promiseResolved = true
    }

    override fun onClick(v: View) {
      if (promiseResolved || !reactContext.hasActiveReactInstance()) return

      val newCalendar = createNewCalendar()
      val result = WritableNativeMap()

      result.putString("action", RNConstants.ACTION_DATE_SET)
      result.putDouble("timestamp", newCalendar.timeInMillis.toDouble())
      result.putDouble(
        "utcOffset",
        newCalendar.timeZone.getOffset(newCalendar.timeInMillis).toDouble() / 1000 / 60
      )

      promise.resolve(result)
      promiseResolved = true
    }

    private fun createNewCalendar(): Calendar {
      val initialDate = RNDate(args)
      val calendar = Calendar.getInstance(
        Common.getTimeZone(
          args
        )
      )

      calendar[initialDate.year(), initialDate.month(), initialDate.day(), timePicker!!.hour, timePicker!!.minute] =
        0

      calendar[Calendar.MILLISECOND] = 0

      return calendar
    }
  }
}
