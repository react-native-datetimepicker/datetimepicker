/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * <p>
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * </p>
 */

package com.reactcommunity.rndatetimepicker;

import static com.reactcommunity.rndatetimepicker.Common.getDisplayTime;
import static com.reactcommunity.rndatetimepicker.Common.setButtonTextColor;

import android.app.Dialog;
import android.app.TimePickerDialog;
import android.app.TimePickerDialog.OnTimeSetListener;
import android.content.Context;
import android.content.DialogInterface;
import android.content.DialogInterface.OnDismissListener;
import android.content.DialogInterface.OnClickListener;
import android.os.Bundle;
import android.text.format.DateFormat;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;

@SuppressWarnings("ValidFragment")
public class RNTimePickerDialogFragment extends DialogFragment {
  private TimePickerDialog instance;

  @Nullable
  private OnTimeSetListener mOnTimeSetListener;
  @Nullable
  private OnDismissListener mOnDismissListener;
  @Nullable
  private static OnClickListener mOnNeutralButtonActionListener;

  @NonNull
  @Override
  public Dialog onCreateDialog(Bundle savedInstanceState) {
    final Bundle args = getArguments();
    instance = createDialog(args, getActivity(), mOnTimeSetListener);
    return instance;
  }

  public void update(Bundle args) {
    final RNDate date = new RNDate(args);
    instance.updateTime(date.hour(), date.minute());
  }

  static TimePickerDialog getDialog(
          Bundle args,
          Context activityContext,
          @Nullable OnTimeSetListener onTimeSetListener) {

    final RNDate date = new RNDate(args);
    final int hour = date.hour();
    final int minute = date.minute();
    boolean is24hour = DateFormat.is24HourFormat(activityContext);

    int minuteInterval = RNConstants.DEFAULT_TIME_PICKER_INTERVAL;
    if (args != null && MinuteIntervalSnappableTimePickerDialog.isValidMinuteInterval(args.getInt(RNConstants.ARG_INTERVAL))) {
      minuteInterval = args.getInt(RNConstants.ARG_INTERVAL);
    }

    RNTimePickerDisplay display = getDisplayTime(args);

    if (display == RNTimePickerDisplay.SPINNER) {
        return new RNDismissableTimePickerDialog(
                activityContext,
				R.style.SpinnerTimePickerDialog,
                onTimeSetListener,
                hour,
                minute,
                minuteInterval,
                is24hour,
                display
        );
    }
    return new RNDismissableTimePickerDialog(
      activityContext,
      onTimeSetListener,
      hour,
      minute,
      minuteInterval,
      is24hour,
      display
    );
  }

  static TimePickerDialog createDialog(
          Bundle args, Context activityContext,
          @Nullable OnTimeSetListener onTimeSetListener) {

    TimePickerDialog dialog = getDialog(args, activityContext, onTimeSetListener);

    if (args != null) {
      if (args.containsKey(RNConstants.ARG_NEUTRAL_BUTTON_LABEL)) {
        dialog.setButton(DialogInterface.BUTTON_NEUTRAL, args.getString(RNConstants.ARG_NEUTRAL_BUTTON_LABEL), mOnNeutralButtonActionListener);
      }
      if (args.containsKey(RNConstants.ARG_POSITIVE_BUTTON_LABEL)) {
        dialog.setButton(DialogInterface.BUTTON_POSITIVE, args.getString(RNConstants.ARG_POSITIVE_BUTTON_LABEL), dialog);
      }
      if (args.containsKey(RNConstants.ARG_NEGATIVE_BUTTON_LABEL)) {
        dialog.setButton(DialogInterface.BUTTON_NEGATIVE, args.getString(RNConstants.ARG_NEGATIVE_BUTTON_LABEL), dialog);
      }
      RNTimePickerDisplay display = getDisplayTime(args);
      if (display == RNTimePickerDisplay.SPINNER) {
        dialog.setOnShowListener(setButtonTextColor(activityContext, dialog));
      }
    }
    return dialog;
  }

  @Override
  public void onDismiss(@NonNull DialogInterface dialog) {
    super.onDismiss(dialog);
    if (mOnDismissListener != null) {
      mOnDismissListener.onDismiss(dialog);
    }
  }

  public void setOnDismissListener(@Nullable OnDismissListener onDismissListener) {
    mOnDismissListener = onDismissListener;
  }

  public void setOnTimeSetListener(@Nullable OnTimeSetListener onTimeSetListener) {
    mOnTimeSetListener = onTimeSetListener;
  }

  /*package*/ void setOnNeutralButtonActionListener(@Nullable OnClickListener onNeutralButtonActionListener) {
    mOnNeutralButtonActionListener = onNeutralButtonActionListener;
  }
}
