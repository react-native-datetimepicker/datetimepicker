/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * <p>
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * </p>
 */
package com.reactcommunity.rndatetimepicker;

import android.app.TimePickerDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.res.Resources;
import android.os.Build;
import android.widget.NumberPicker;
import android.widget.TimePicker;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

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

  private TimePicker mTimePicker;
  private int mTimePickerInterval;
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
    super(context, listener, hourOfDay, minute, is24HourView);
    mTimePickerInterval = minuteInterval;
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
    super(context, theme, listener, hourOfDay, minute, is24HourView);
    mTimePickerInterval = minuteInterval;
    mTimeSetListener = listener;
    mDisplay = display;
  }

  private int getRealMinutes(int minute) {
    if (mDisplay == RNTimePickerDisplay.SPINNER) {
      return minute * mTimePickerInterval;
    }

    return minute;
  }

  private int snapMinutesToInterval(int realMinutes) {
    float stepsInMinutes = (float) realMinutes / (float) mTimePickerInterval;

    if (mDisplay == RNTimePickerDisplay.SPINNER) {
      return Math.round(stepsInMinutes);
    }

    return Math.round(stepsInMinutes) * mTimePickerInterval;
  }

  @Override
  public void onTimeChanged(TimePicker view, int hourOfDay, int minute) {
    int realMinutes = getRealMinutes(minute);

    if (realMinutes % mTimePickerInterval != 0) {
      view.setCurrentMinute(snapMinutesToInterval(realMinutes));
      return;
    }

    super.onTimeChanged(view, hourOfDay, realMinutes);
  }

  @Override
  public void updateTime(int hourOfDay, int minuteOfHour) {
    mTimePicker.setCurrentHour(hourOfDay);
    mTimePicker.setCurrentMinute(snapMinutesToInterval(minuteOfHour));
  }

  @Override
  public void onClick(DialogInterface dialog, int which) {
    switch (which) {
      case BUTTON_POSITIVE:
        if (mTimeSetListener != null) {
          mTimeSetListener.onTimeSet(
            mTimePicker,
            mTimePicker.getCurrentHour(),
            getRealMinutes(mTimePicker.getCurrentMinute())
          );
        }
        break;
      case BUTTON_NEGATIVE:
        cancel();
        break;
    }
  }

  /**
   * Apply visual style in 'spinner' mode
   * Adjust minutes to correspond selected interval
   */
  @Override
  public void onAttachedToWindow() {
    super.onAttachedToWindow();

    try {
      int timePickerId = Resources.getSystem()
        .getIdentifier("timePicker", "id", "android");

      mTimePicker = this.findViewById(timePickerId);

      if (mDisplay == RNTimePickerDisplay.SPINNER) {
        int minutePickerId = Resources.getSystem()
          .getIdentifier("minute", "id", "android");
        NumberPicker minutePicker = this.findViewById(minutePickerId);

        minutePicker.setMinValue(0);
        minutePicker.setMaxValue((60 / mTimePickerInterval) - 1);

        List<String> displayedValues = new ArrayList<>();
        for (int i = 0; i < 60; i += mTimePickerInterval) {
          displayedValues.add(String.format(Locale.US, "%02d", i));
        }

        minutePicker.setDisplayedValues(displayedValues.toArray(new String[displayedValues.size()]));
      }

      int currentMinute = mTimePicker.getCurrentMinute();
      mTimePicker.setCurrentMinute(snapMinutesToInterval(currentMinute));
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
