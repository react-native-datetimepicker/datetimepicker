/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * <p>
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * </p>
 */
package com.reactcommunity.rndatetimepicker;

import static com.reactcommunity.rndatetimepicker.ReflectionHelper.findField;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;

import android.app.TimePickerDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.os.Build;
import android.util.AttributeSet;
import android.util.Log;
import android.widget.NumberPicker;
import android.widget.TimePicker;

import androidx.annotation.Nullable;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

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
      view.setCurrentHour(hourOfDay);
      return;
    }

    super.onTimeChanged(view, hourOfDay, realMinutes);
  }

  @Override
  public void onClick(DialogInterface dialog, int which) {
    switch (which) {
      case BUTTON_POSITIVE:
        if (mTimeSetListener != null) {
          mTimeSetListener.onTimeSet(mTimePicker, mTimePicker.getCurrentHour(),
                getRealMinutes(mTimePicker.getCurrentMinute()));
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
      int timePickerId = Resources.getSystem()
        .getIdentifier("timePicker", "id", "android");

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
    fixSpinner(context, hourOfDay, minute, is24HourView, display);
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
    fixSpinner(context, hourOfDay, minute, is24HourView, display);
    super(context, theme, callback, hourOfDay, minute, minuteInterval, is24HourView, display);
  }

  @Override
  protected void onStop() {
    if (Build.VERSION.SDK_INT > Build.VERSION_CODES.KITKAT) {
      super.onStop();
    }
  }

  private void fixSpinner(Context context, int hourOfDay, int minute, boolean is24HourView, RNTimePickerDisplay display) {
    if (Build.VERSION.SDK_INT == Build.VERSION_CODES.N && display == RNTimePickerDisplay.SPINNER) {
      try {
        Class<?> styleableClass = Class.forName("com.android.internal.R$styleable");
        Field timePickerStyleableField = styleableClass.getField("TimePicker");
        int[] timePickerStyleable = (int[]) timePickerStyleableField.get(null);
        final TypedArray a = context.obtainStyledAttributes(null, timePickerStyleable, android.R.attr.timePickerStyle, 0);
        a.recycle();

        TimePicker timePicker = (TimePicker) findField(TimePickerDialog.class, TimePicker.class, "mTimePicker").get(this);
        Class<?> delegateClass = Class.forName("android.widget.TimePicker$TimePickerDelegate");
        Field delegateField = findField(TimePicker.class, delegateClass, "mDelegate");
        Object delegate = delegateField.get(timePicker);
        Class<?> spinnerDelegateClass;
        spinnerDelegateClass = Class.forName("android.widget.TimePickerSpinnerDelegate");
        // In 7.0 Nougat for some reason the timePickerMode is ignored and the delegate is TimePickerClockDelegate
        if (delegate.getClass() != spinnerDelegateClass) {
          delegateField.set(timePicker, null); // throw out the TimePickerClockDelegate!
          timePicker.removeAllViews(); // remove the TimePickerClockDelegate views
          Constructor spinnerDelegateConstructor = spinnerDelegateClass.getConstructor(TimePicker.class, Context.class, AttributeSet.class, int.class, int.class);
          spinnerDelegateConstructor.setAccessible(true);
          // Instantiate a TimePickerSpinnerDelegate
          delegate = spinnerDelegateConstructor.newInstance(timePicker, context, null, android.R.attr.timePickerStyle, 0);
          delegateField.set(timePicker, delegate); // set the TimePicker.mDelegate to the spinner delegate
          // Set up the TimePicker again, with the TimePickerSpinnerDelegate
          timePicker.setIs24HourView(is24HourView);
          timePicker.setCurrentHour(hourOfDay);
          timePicker.setCurrentMinute(minute);
          timePicker.setOnTimeChangedListener(this);
        }
      } catch (Exception e) {
        throw new RuntimeException(e);
      }
    }
  }
}
