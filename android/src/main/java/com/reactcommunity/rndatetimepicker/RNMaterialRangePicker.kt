package com.reactcommunity.rndatetimepicker

import android.content.DialogInterface
import android.os.Bundle
import androidx.core.util.Pair
import androidx.fragment.app.FragmentManager
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableNativeMap
import com.google.android.material.datepicker.CalendarConstraints
import com.google.android.material.datepicker.CalendarConstraints.DateValidator
import com.google.android.material.datepicker.CompositeDateValidator
import com.google.android.material.datepicker.DateValidatorPointBackward
import com.google.android.material.datepicker.DateValidatorPointForward
import com.google.android.material.datepicker.MaterialDatePicker
import com.google.android.material.datepicker.MaterialPickerOnPositiveButtonClickListener
import java.util.Calendar

class RNMaterialRangePicker(
  private val args: Bundle,
  private val promise: Promise,
  private val fragmentManager: FragmentManager,
  private val reactContext: ReactApplicationContext
) {
  private var promiseResolved = false
  private var rangePicker: MaterialDatePicker<Pair<Long, Long>>? = null
  private var builder = MaterialDatePicker.Builder.dateRangePicker()

  fun open() {
    createRangePicker()
    addListeners()
    show()
  }

  private fun createRangePicker() {
    setInitialDates()
    setTitle()
    setInputMode()
    setButtons()
    setConstraints()
    setFullscreen()

    rangePicker = builder.build()
  }

  private fun setInitialDates() {
    var start: Long? = null
    var end: Long? = null

    if (args.containsKey(RNConstants.ARG_START_TIMESTAMP)) {
      // override "value" so we can use the same constructor from RNDate
      args.putLong(RNConstants.ARG_VALUE, args.getLong((RNConstants.ARG_START_TIMESTAMP)))
      start = RNDate(args).timestamp()
    }

    if (args.containsKey(RNConstants.ARG_END_TIMESTAMP)) {
      // override "value" so we can use the same constructor from RNDate
      args.putLong(RNConstants.ARG_VALUE, args.getLong((RNConstants.ARG_END_TIMESTAMP)))
      end = RNDate(args).timestamp()
    }

    val selection = Pair(start, end)
    builder.setSelection(selection)
  }

  private fun setTitle() {
    val title = args.getString(RNConstants.ARG_TITLE)
    if (!title.isNullOrEmpty()) {
      builder.setTitleText(args.getString(RNConstants.ARG_TITLE))
    }
  }

  private fun setInputMode() {
    if (args.getString(RNConstants.ARG_INITIAL_INPUT_MODE).isNullOrEmpty()) {
      builder.setInputMode(MaterialDatePicker.INPUT_MODE_CALENDAR)
      return
    }

    val inputMode =
      RNMaterialInputMode.valueOf(
        args.getString(RNConstants.ARG_INITIAL_INPUT_MODE)!!.uppercase()
      )

    if (inputMode == RNMaterialInputMode.KEYBOARD) {
      builder.setInputMode(MaterialDatePicker.INPUT_MODE_TEXT)
    } else {
      builder.setInputMode(MaterialDatePicker.INPUT_MODE_CALENDAR)
    }
  }

  private fun setConstraints() {
    val constraintsBuilder = CalendarConstraints.Builder()

    if (args.containsKey(RNConstants.FIRST_DAY_OF_WEEK)) {
      constraintsBuilder.setFirstDayOfWeek(args.getInt(RNConstants.FIRST_DAY_OF_WEEK))
    }

    val validators = mutableListOf<DateValidator>()

    if (args.containsKey(RNConstants.ARG_MINDATE)) {
      val minDate = Common.minDateWithTimeZone(args)
      validators.add(DateValidatorPointForward.from(minDate))
    }

    if (args.containsKey(RNConstants.ARG_MAXDATE)) {
      val maxDate = Common.maxDateWithTimeZone(args)
      validators.add(DateValidatorPointBackward.before(maxDate))
    }

    constraintsBuilder.setValidator(CompositeDateValidator.allOf(validators))
    builder.setCalendarConstraints(constraintsBuilder.build())
  }

  private fun setFullscreen() {
    val isFullscreen = args.getBoolean(RNConstants.ARG_FULLSCREEN)

    if (isFullscreen) {
      builder.setTheme(com.google.android.material.R.style.ThemeOverlay_Material3_MaterialCalendar_Fullscreen)
    } else {
      builder.setTheme(com.google.android.material.R.style.ThemeOverlay_Material3_MaterialCalendar)
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

  private fun addListeners() {
    val listeners = Listeners()
    rangePicker!!.addOnPositiveButtonClickListener(listeners)
    rangePicker!!.addOnDismissListener(listeners)
  }

  private fun show() {
    rangePicker!!.show(fragmentManager, MaterialRangePickerModule.NAME)
  }

  private inner class Listeners : MaterialPickerOnPositiveButtonClickListener<Pair<Long, Long>>,
    DialogInterface.OnDismissListener {
    override fun onDismiss(dialog: DialogInterface) {
      if (promiseResolved || !reactContext.hasActiveReactInstance()) return

      val result = WritableNativeMap()
      result.putString("action", RNConstants.ACTION_DISMISSED)
      promise.resolve(result)
      promiseResolved = true
    }

    override fun onPositiveButtonClick(selection: Pair<Long, Long>) {
      if (promiseResolved || !reactContext.hasActiveReactInstance()) return

      val result = WritableNativeMap()

      result.putString("action", RNConstants.ACTION_RANGE_SET)
      result.putDouble("startTimestamp", getStartTimestamp(selection))
      result.putDouble("endTimestamp", getEndTimestamp(selection))
      result.putDouble(
        "utcOffset",
        getStartTimestamp(selection) / 1000 / 60
      )

      promise.resolve(result)
      promiseResolved = true
    }

    private fun getStartTimestamp(selection: Pair<Long, Long>): Double {
      val newCalendar = Calendar.getInstance(
        Common.getTimeZone(
          args
        )
      )

      newCalendar.timeInMillis = selection.first
      newCalendar[Calendar.HOUR_OF_DAY] = 0
      newCalendar[Calendar.MINUTE] = 0
      newCalendar[Calendar.SECOND] = 0

      return newCalendar.timeInMillis.toDouble()
    }

    private fun getEndTimestamp(selection: Pair<Long, Long>): Double {
      val newCalendar = Calendar.getInstance(
        Common.getTimeZone(
          args
        )
      )

      newCalendar.timeInMillis = selection.first
      newCalendar[Calendar.HOUR_OF_DAY] = 23
      newCalendar[Calendar.MINUTE] = 59
      newCalendar[Calendar.SECOND] = 59

      return newCalendar.timeInMillis.toDouble()
    }
  }
}
