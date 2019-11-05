/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
package com.reactcommunity.rndatetimepicker;

import android.app.TimePickerDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Build;
import android.util.Log;
import android.widget.NumberPicker;
import android.widget.TimePicker;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Nullable;

/**
 * <p>
 * Certain versions of Android (Jellybean-KitKat) have a bug where when dismissed, the
 * {@link TimePickerDialog} still calls the OnTimeSetListener. This class works around that issue
 * by *not* calling super.onStop on KitKat on lower, as that would erroneously call the
 * OnTimeSetListener when the dialog is dismissed, or call it twice when "OK" is pressed.
 * </p>
 *
 * <p>
 * See: <a href="https://code.google.com/p/android/issues/detail?id=34833">Issue 34833</a>
 * </p>
 */

class CustomTimePickerDialog extends TimePickerDialog {
  private static final String LOG_TAG = CustomTimePickerDialog.class.getSimpleName();

  private int TIME_PICKER_INTERVAL;
  private TimePicker mTimePicker;
  private RNTimePickerDisplay mDisplay;

  private final OnTimeSetListener mTimeSetListener;

  public CustomTimePickerDialog(
      Context context,
      OnTimeSetListener listener,
      int hourOfDay,
      int minute,
      int minuteInterval,
      boolean is24HourView,
      RNTimePickerDisplay display
  ) {
    super(context, listener, hourOfDay, minute / minuteInterval, is24HourView);
    TIME_PICKER_INTERVAL = minuteInterval;
    mTimeSetListener = listener;
    mDisplay = display;
  }

  public CustomTimePickerDialog(
      Context context,
      int theme,
      OnTimeSetListener listener,
      int hourOfDay,
      int minute,
      int minuteInterval,
      boolean is24HourView,
      RNTimePickerDisplay display
  ) {
    super(context, theme, listener, hourOfDay, minute / minuteInterval, is24HourView);
    TIME_PICKER_INTERVAL = minuteInterval;
    mTimeSetListener = listener;
    mDisplay = display;
  }

  @Override
  public void onTimeChanged(TimePicker view, int hourOfDay, int minute) {
    boolean isRadialClock = mDisplay != RNTimePickerDisplay.SPINNER;
    Log.d(LOG_TAG, "isRadialClock?:" + isRadialClock);

    if (isRadialClock && minute % TIME_PICKER_INTERVAL != 0) {
      float stepsInMinutes = minute / TIME_PICKER_INTERVAL;
      int correctedMinutes = Math.round(stepsInMinutes * TIME_PICKER_INTERVAL);

      view.setCurrentMinute(correctedMinutes);
      return;
    }

    super.onTimeChanged(view, hourOfDay, minute);
  }

  @Override
  public void updateTime(int hourOfDay, int minuteOfHour) {
    mTimePicker.setCurrentHour(hourOfDay);
    mTimePicker.setCurrentMinute(minuteOfHour / TIME_PICKER_INTERVAL);
  }

  @Override
  public void onClick(DialogInterface dialog, int which) {
    switch (which) {
      case BUTTON_POSITIVE:
        if (mTimeSetListener != null) {
          mTimeSetListener.onTimeSet(mTimePicker, mTimePicker.getCurrentHour(),
              mTimePicker.getCurrentMinute() * TIME_PICKER_INTERVAL);
        }
        break;
      case BUTTON_NEGATIVE:
        cancel();
        break;
    }
  }

  /**
   * Apply visual style in 'spinner' mode
   */
  @Override
  public void onAttachedToWindow() {
    super.onAttachedToWindow();

    try {
      Class<?> pickerInternalClass = Class.forName("com.android.internal.R$id");
      Log.d(LOG_TAG, "pickerInternalClass:" + pickerInternalClass);
      mTimePicker = findViewById(pickerInternalClass.getField("timePicker").getInt(null));

      if (mDisplay != RNTimePickerDisplay.SPINNER) {
        return;
      }

      NumberPicker minuteSpinner = mTimePicker.findViewById(pickerInternalClass.getField("minute").getInt(null));

      minuteSpinner.setMinValue(0);
      minuteSpinner.setMaxValue((60 / TIME_PICKER_INTERVAL) - 1);

      List<String> displayedValues = new ArrayList<>();
      for (int i = 0; i < 60; i += TIME_PICKER_INTERVAL) {
        displayedValues.add(String.format("%02d", i));
      }

      minuteSpinner.setDisplayedValues(displayedValues.toArray(new String[displayedValues.size()]));
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}


public class RNDismissableTimePickerDialog extends CustomTimePickerDialog {

  public RNDismissableTimePickerDialog(
      Context context,
      @Nullable TimePickerDialog.OnTimeSetListener callback,
      int hourOfDay,
      int minute,
      int minuteInterval,
      boolean is24HourView,
      RNTimePickerDisplay display
  ) {
    super(context, callback, hourOfDay, minute, minuteInterval, is24HourView, display);
  }

  public RNDismissableTimePickerDialog(
      Context context,
      int theme,
      @Nullable TimePickerDialog.OnTimeSetListener callback,
      int hourOfDay,
      int minute,
      int minuteInterval,
      boolean is24HourView,
      RNTimePickerDisplay display
  ) {
    super(context, theme, callback, hourOfDay, minute, minuteInterval, is24HourView, display);
  }

  @Override
  protected void onStop() {
    if (Build.VERSION.SDK_INT > Build.VERSION_CODES.KITKAT) {
      super.onStop();
    }
  }

}
