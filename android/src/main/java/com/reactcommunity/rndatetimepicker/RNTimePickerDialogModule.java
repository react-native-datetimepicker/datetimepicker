/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * <p>
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * </p>
 */

package com.reactcommunity.rndatetimepicker;

import android.app.TimePickerDialog.OnTimeSetListener;
import android.content.DialogInterface;
import android.content.DialogInterface.OnDismissListener;
import android.os.Bundle;
import android.widget.TimePicker;

import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.common.annotations.VisibleForTesting;
import com.facebook.react.module.annotations.ReactModule;

import javax.annotation.Nullable;

/**
 * {@link NativeModule} that allows JS to show a native time picker dialog and get called back when
 * the user selects a time.
 */
@ReactModule(name = RNTimePickerDialogModule.FRAGMENT_TAG)
public class RNTimePickerDialogModule extends ReactContextBaseJavaModule {

  @VisibleForTesting
  public static final String FRAGMENT_TAG = "RNTimePickerAndroid";

  public RNTimePickerDialogModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return FRAGMENT_TAG;
  }

  private class TimePickerDialogListener implements OnTimeSetListener, OnDismissListener {
    private final Promise mPromise;
    private boolean mPromiseResolved = false;

    public TimePickerDialogListener(Promise promise) {
      mPromise = promise;
    }

    @Override
    public void onTimeSet(TimePicker view, int hour, int minute) {
      if (!mPromiseResolved && getReactApplicationContext().hasActiveCatalystInstance()) {
        WritableMap result = new WritableNativeMap();
        result.putString("action", RNConstants.ACTION_TIME_SET);
        result.putInt("hour", hour);
        result.putInt("minute", minute);
        mPromise.resolve(result);
        mPromiseResolved = true;
      }
    }

    @Override
    public void onDismiss(DialogInterface dialog) {
      if (!mPromiseResolved && getReactApplicationContext().hasActiveCatalystInstance()) {
        WritableMap result = new WritableNativeMap();
        result.putString("action", RNConstants.ACTION_DISMISSED);
        mPromise.resolve(result);
        mPromiseResolved = true;
      }
    }
  }

  @ReactMethod
  public void open(@Nullable final ReadableMap options, Promise promise) {

    FragmentActivity activity = (FragmentActivity) getCurrentActivity();
    if (activity == null) {
      promise.reject(
        RNConstants.ERROR_NO_ACTIVITY,
        "Tried to open a TimePicker dialog while not attached to an Activity");
      return;
    }
    // We want to support both android.app.Activity and the pre-Honeycomb FragmentActivity
    // (for apps that use it for legacy reasons). This unfortunately leads to some code duplication.
    FragmentManager fragmentManager = activity.getSupportFragmentManager();
    final RNTimePickerDialogFragment oldFragment = (RNTimePickerDialogFragment) fragmentManager.findFragmentByTag(FRAGMENT_TAG);

    if (oldFragment != null && options != null) {
      UiThreadUtil.runOnUiThread(new Runnable() {
        @Override
        public void run() {
          oldFragment.update(createFragmentArguments(options));
        }
      });

      return;
    }

    RNTimePickerDialogFragment fragment = new RNTimePickerDialogFragment();

    if (options != null) {
      fragment.setArguments(createFragmentArguments(options));
    }

    final TimePickerDialogListener listener = new TimePickerDialogListener(promise);
    fragment.setOnDismissListener(listener);
    fragment.setOnTimeSetListener(listener);
    fragment.show(fragmentManager, FRAGMENT_TAG);
  }

  private Bundle createFragmentArguments(ReadableMap options) {
    final Bundle args = new Bundle();
    if (options.hasKey(RNConstants.ARG_VALUE) && !options.isNull(RNConstants.ARG_VALUE)) {
      args.putLong(RNConstants.ARG_VALUE, (long) options.getDouble(RNConstants.ARG_VALUE));
    }
    if (options.hasKey(RNConstants.ARG_IS24HOUR) && !options.isNull(RNConstants.ARG_IS24HOUR)) {
      args.putBoolean(RNConstants.ARG_IS24HOUR, options.getBoolean(RNConstants.ARG_IS24HOUR));
    }
    if (options.hasKey(RNConstants.ARG_DISPLAY) && !options.isNull(RNConstants.ARG_DISPLAY)) {
      args.putString(RNConstants.ARG_DISPLAY, options.getString(RNConstants.ARG_DISPLAY));
    }
    if (options.hasKey(RNConstants.ARG_INTERVAL) && !options.isNull(RNConstants.ARG_INTERVAL)) {
      args.putInt(RNConstants.ARG_INTERVAL, options.getInt(RNConstants.ARG_INTERVAL));
    }
    return args;
  }
}
