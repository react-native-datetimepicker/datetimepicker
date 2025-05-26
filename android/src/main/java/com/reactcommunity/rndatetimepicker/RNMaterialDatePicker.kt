package com.reactcommunity.rndatetimepicker

import android.content.DialogInterface
import android.os.Bundle
import android.util.TypedValue
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
import com.google.android.material.R
import java.util.Calendar

class RNMaterialDatePicker(
  private val args: Bundle,
  private val promise: Promise,
  private val fragmentManager: FragmentManager,
  private val reactContext: ReactApplicationContext
) {
  private var promiseResolved = false
  private var datePicker: MaterialDatePicker<Long>? = null
  private var builder =  MaterialDatePicker.Builder.datePicker()

  fun open() {
    createDatePicker()
    addListeners()
    show()
  }

  private fun createDatePicker() {
    setInitialDate()
    setTitle()
    setInputMode()
    setButtons()
    setConstraints()
    setFullscreen()

    datePicker = builder.build()
  }

  private fun setInitialDate() {
    val initialDate = RNDate(args)
    builder.setSelection(initialDate.timestamp())
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
      val themeId = obtainMaterialThemeOverlayId(R.attr.materialCalendarFullscreenTheme)
      builder.setTheme(themeId)
    } else {
      val themeId = obtainMaterialThemeOverlayId(R.attr.materialCalendarTheme)
      builder.setTheme(themeId)
    }
  }

  private fun obtainMaterialThemeOverlayId(resId: Int): Int {
    val theme = reactContext.currentActivity?.theme ?: run {
      return resId
    }

    val typedValue = TypedValue()
    theme.resolveAttribute(resId, typedValue, true)
    return typedValue.resourceId
  }

  private fun addListeners() {
    val listeners = Listeners()
    datePicker!!.addOnPositiveButtonClickListener(listeners)
    datePicker!!.addOnDismissListener(listeners)
  }

  private fun show() {
    datePicker!!.show(fragmentManager, MaterialDatePickerModule.NAME)
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

  private inner class Listeners : MaterialPickerOnPositiveButtonClickListener<Long>,
    DialogInterface.OnDismissListener {
    override fun onDismiss(dialog: DialogInterface) {
      if (promiseResolved || !reactContext.hasActiveReactInstance()) return

      val result = WritableNativeMap()
      result.putString("action", RNConstants.ACTION_DISMISSED)
      promise.resolve(result)
      promiseResolved = true
    }

    override fun onPositiveButtonClick(selection: Long) {
      if (promiseResolved || !reactContext.hasActiveReactInstance()) return

      val newCalendar = createNewCalendar(selection)
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

    private fun createNewCalendar(selection: Long): Calendar {
      val initialDate = RNDate(args)
      val newCalendar = Calendar.getInstance(
        Common.getTimeZone(
          args
        )
      )

      newCalendar.timeInMillis = selection

      newCalendar[Calendar.HOUR_OF_DAY] = initialDate.hour()
      newCalendar[Calendar.MINUTE] = initialDate.minute()
      newCalendar[Calendar.SECOND] = 0
      newCalendar[Calendar.MILLISECOND] = 0

      return newCalendar
    }
  }
}
