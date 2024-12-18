/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * <p>
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * </p>
 */

package com.reactcommunity.rndatetimepicker;

import com.facebook.react.bridge.*;
import com.facebook.react.common.annotations.VisibleForTesting;
import com.facebook.react.module.annotations.ReactModule;

import android.app.TimePickerDialog.OnTimeSetListener;
import android.content.DialogInterface;
import android.content.DialogInterface.OnDismissListener;
import android.content.DialogInterface.OnClickListener;
import android.os.Bundle;
import android.widget.TimePicker;

import androidx.annotation.NonNull;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;

import static com.reactcommunity.rndatetimepicker.Common.createTimePickerArguments;
import static com.reactcommunity.rndatetimepicker.Common.dismissDialog;

import java.util.Calendar;

/**
 * {@link NativeModule} that allows JS to show a native time picker dialog and get called back when
 * the user selects a time.
 */
@ReactModule(name = TimePickerModule.NAME)
public class TimePickerModule extends NativeModuleTimePickerSpec {

  @VisibleForTesting
  public static final String NAME = "RNCTimePicker";

  public TimePickerModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @NonNull
  @Override
  public String getName() {
    return NAME;
  }

  private class TimePickerDialogListener implements OnTimeSetListener, OnDismissListener, OnClickListener {
    private final Promise mPromise;
    private final Bundle mArgs;
    private boolean mPromiseResolved = false;

    public TimePickerDialogListener(Promise promise, Bundle arguments) {
      mPromise = promise;
      mArgs = arguments;
    }

    @Override
    public void onTimeSet(TimePicker view, int hour, int minute) {
      if (!mPromiseResolved && getReactApplicationContext().hasActiveReactInstance()) {
        final RNDate date = new RNDate(mArgs);
        Calendar calendar = Calendar.getInstance(Common.getTimeZone(mArgs));
        calendar.set(date.year(), date.month(), date.day(), hour, minute, 0);
        calendar.set(Calendar.MILLISECOND, 0);

        WritableMap result = new WritableNativeMap();
        result.putString("action", RNConstants.ACTION_TIME_SET);
        result.putDouble("timestamp", calendar.getTimeInMillis());
        result.putDouble("utcOffset", calendar.getTimeZone().getOffset(calendar.getTimeInMillis()) / 1000 / 60);

        mPromise.resolve(result);
        mPromiseResolved = true;
      }
    }

    @Override
    public void onDismiss(DialogInterface dialog) {
      if (!mPromiseResolved && getReactApplicationContext().hasActiveReactInstance()) {
        WritableMap result = new WritableNativeMap();
        result.putString("action", RNConstants.ACTION_DISMISSED);
        mPromise.resolve(result);
        mPromiseResolved = true;
      }
    }

    @Override
    public void onClick(DialogInterface dialog, int which) {
      if (!mPromiseResolved && getReactApplicationContext().hasActiveReactInstance()) {
        WritableMap result = new WritableNativeMap();
        result.putString("action", RNConstants.ACTION_NEUTRAL_BUTTON);
        mPromise.resolve(result);
        mPromiseResolved = true;
      }
    }
  }

  @ReactMethod
  public void dismiss(Promise promise) {
    FragmentActivity activity = (FragmentActivity) getCurrentActivity();
    dismissDialog(activity, NAME, promise);
  }

  @ReactMethod
  public void open(final ReadableMap options, final Promise promise) {
    FragmentActivity activity = (FragmentActivity) getCurrentActivity();
    if (activity == null) {
      promise.reject(
              RNConstants.ERROR_NO_ACTIVITY,
              "Tried to open a TimePicker dialog while not attached to an Activity");
      return;
    }
    // We want to support both android.app.Activity and the pre-Honeycomb FragmentActivity
    // (for apps that use it for legacy reasons). This unfortunately leads to some code duplication.
    final FragmentManager fragmentManager = activity.getSupportFragmentManager();

    UiThreadUtil.runOnUiThread(() -> {
      RNTimePickerDialogFragment oldFragment =
              (RNTimePickerDialogFragment) fragmentManager.findFragmentByTag(NAME);

      Bundle arguments = createTimePickerArguments(options);

      if (oldFragment != null) {
        oldFragment.update(arguments);
        return;
      }

      RNTimePickerDialogFragment fragment = new RNTimePickerDialogFragment();

      fragment.setArguments(arguments);

      final TimePickerDialogListener listener = new TimePickerDialogListener(promise, arguments);
      fragment.setOnDismissListener(listener);
      fragment.setOnTimeSetListener(listener);
      fragment.setOnNeutralButtonActionListener(listener);
      fragment.show(fragmentManager, NAME);
    });
  }
}
