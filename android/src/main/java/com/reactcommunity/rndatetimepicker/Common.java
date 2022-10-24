package com.reactcommunity.rndatetimepicker;

import android.app.AlertDialog;
import android.app.DatePickerDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.res.Resources;
import android.util.TypedValue;
import android.widget.Button;

import androidx.annotation.ColorInt;
import androidx.annotation.ColorRes;
import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.DialogFragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;

import com.facebook.react.bridge.Promise;

public class Common {

  public static void dismissDialog(FragmentActivity activity, String fragmentTag, Promise promise) {
    if (activity == null) {
      promise.reject(
              RNConstants.ERROR_NO_ACTIVITY,
              "Tried to close a " + fragmentTag + " dialog while not attached to an Activity");
      return;
    }

    try {
      FragmentManager fragmentManager = activity.getSupportFragmentManager();
      final DialogFragment oldFragment = (DialogFragment) fragmentManager.findFragmentByTag(fragmentTag);

      boolean fragmentFound = oldFragment != null;
      if (fragmentFound) {
        oldFragment.dismiss();
      }

      promise.resolve(fragmentFound);
    } catch (Exception e) {
      promise.reject(e);
    }
  }

	public static int getDefaultDialogButtonTextColor(@NonNull Context activity) {
		TypedValue typedValue = new TypedValue();
		Resources.Theme theme = activity.getTheme();
		theme.resolveAttribute(android.R.attr.textColorPrimary, typedValue, true);
		@ColorRes int colorRes = (typedValue.resourceId != 0) ? typedValue.resourceId : typedValue.data;
		@ColorInt int colorId = ContextCompat.getColor(activity, colorRes);
		return colorId;
	}

	@NonNull
	public static DialogInterface.OnShowListener ensureButtonsVisible(@NonNull Context activityContext, final AlertDialog dialog) {
		return presentedDialog -> {
			int textColorPrimary = getDefaultDialogButtonTextColor(activityContext);
			Button positiveButton = dialog.getButton(DatePickerDialog.BUTTON_POSITIVE);
			if (positiveButton != null) {
				positiveButton.setTextColor(textColorPrimary);
			}
			Button negativeButton = dialog.getButton(DatePickerDialog.BUTTON_NEGATIVE);
			if (negativeButton != null) {
				negativeButton.setTextColor(textColorPrimary);
			}
			Button neutralButton = dialog.getButton(DatePickerDialog.BUTTON_NEUTRAL);
			if (neutralButton != null) {
				neutralButton.setTextColor(textColorPrimary);
			}
		};
	}
}
