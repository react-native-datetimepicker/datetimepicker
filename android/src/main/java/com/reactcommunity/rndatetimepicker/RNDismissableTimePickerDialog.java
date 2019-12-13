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
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.widget.EditText;
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
  private Handler handler = new Handler();
  private Runnable runnable;

  private final int textInputPickerID = Resources.getSystem()
    .getIdentifier("input_mode", "id", "android");

  private final int timePickerId = Resources.getSystem()
    .getIdentifier("timePicker", "id", "android");

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

  /**
   * Converts values returned from picker to actual minutes
   *
   * @param minute the internal value of what the user had selected on picker
   * @return returns 'real' minutes (0-59)
   */
  private int getRealMinutes(int minute) {
    if (mDisplay == RNTimePickerDisplay.SPINNER) {
      return minute * mTimePickerInterval;
    }

    return minute;
  }

  /**
   * 'Snaps' real minutes to nearest valid value
   *
   * @param realMinutes 'real' minutes (0-59)
   * @return nearest valid value
   */
  private int snapMinutesToInterval(int realMinutes) {
    float stepsInMinutes = (float) realMinutes / (float) mTimePickerInterval;

    if (mDisplay == RNTimePickerDisplay.SPINNER) {
      return Math.round(stepsInMinutes);
    }

    return Math.round(stepsInMinutes) * mTimePickerInterval;
  }

  /**
   * Determines if real minutes align setted minuteInterval
   *
   * @param realMinutes 'real' minutes (0-59)
   */
  private boolean minutesAreInvalid(int realMinutes) {
    return realMinutes % mTimePickerInterval != 0;
  }

  /**
   * Determines if the picker is in text input mode (keyboard icon in 'clock' mode)
   */
  private boolean pickerIsInTextInputMode() {
    final View textInputPicker = this.findViewById(textInputPickerID);

    return textInputPicker != null && textInputPicker.hasFocus();
  }

  /**
   * Corrects minute values if they don't align with minuteInterval
   *
   * If the picker is in text input mode, correction will be postponed slightly to let the user
   * finish the input
   *
   * If the picker is not in text input mode, correction will take place immidiately
   *
   * @param view the picker's view
   * @param hourOfDay the picker's selected hours
   * @param realMinutes 'real' minutes (0-59)
   */
  private void correctEnteredMinutes(final TimePicker view, final int hourOfDay, final int realMinutes) {
    if (pickerIsInTextInputMode()) {
      final EditText textInput = (EditText) view.findFocus();

      // 'correction' callback
      runnable = new Runnable() {
        @Override
        public void run() {
          // set valid minutes && move caret to the end of input
          view.setCurrentMinute(snapMinutesToInterval(realMinutes));
          view.setCurrentHour(hourOfDay);
          textInput.setSelection(textInput.getText().length());
        }
      };

      handler.postDelayed(runnable, 500);
      return;
    }

    view.setCurrentMinute(snapMinutesToInterval(realMinutes));
    view.setCurrentHour(hourOfDay);
  }

  @Override
  public void onTimeChanged(final TimePicker view, final int hourOfDay, final int minute) {
    final int realMinutes = getRealMinutes(minute);

    // remove pending 'validation' callbacks if any
    handler.removeCallbacks(runnable);

    if (minutesAreInvalid(realMinutes)) {
      correctEnteredMinutes(view, hourOfDay, realMinutes);
      return;
    }

    super.onTimeChanged(view, hourOfDay, realMinutes);
  }

  @Override
  public void onClick(DialogInterface dialog, int which) {
    Log.d(LOG_TAG, "onClick" + which);
    switch (which) {
      case BUTTON_POSITIVE:
        final int hours = mTimePicker.getCurrentHour();
        final int realMinutes = getRealMinutes(mTimePicker.getCurrentMinute());
        int minutesToCallListenerWith = realMinutes;

        if (pickerIsInTextInputMode() && minutesAreInvalid(realMinutes)) {
          minutesToCallListenerWith = snapMinutesToInterval(realMinutes);
        }

        if (mTimeSetListener != null) {
          mTimeSetListener.onTimeSet(mTimePicker, hours, minutesToCallListenerWith);
        }
        break;
      case BUTTON_NEGATIVE:
        cancel();
        break;
    }
  }

  @Override
  public void updateTime(int hourOfDay, int minuteOfHour) {
    mTimePicker.setCurrentHour(hourOfDay);
    mTimePicker.setCurrentMinute(snapMinutesToInterval(minuteOfHour));
  }

  /**
   * Apply visual style in 'spinner' mode
   * Adjust minutes to correspond selected interval
   */
  @Override
  public void onAttachedToWindow() {
    super.onAttachedToWindow();

    try {
      mTimePicker = this.findViewById(timePickerId);
      int currentMinute = mTimePicker.getCurrentMinute();

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

        minutePicker.setDisplayedValues(displayedValues.toArray(new String[0]));
      }

      mTimePicker.setCurrentMinute(snapMinutesToInterval(currentMinute));
    } catch (Exception e) {
      Log.e(LOG_TAG, "onAttachedToWindow encountered an error:");
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
