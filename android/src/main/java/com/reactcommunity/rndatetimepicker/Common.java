package com.reactcommunity.rndatetimepicker;

import android.app.AlertDialog;
import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.res.Resources;
import android.graphics.Color;
import android.os.Bundle;
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

import java.util.Locale;

public class Common {

  public static final String POSITIVE = "positive";
  public static final String NEUTRAL = "neutral";
  public static final String NEGATIVE = "negative";
  public static final String LABEL = "label";
  public static final String TEXT_COLOR = "textColor";

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
	public static DialogInterface.OnShowListener setButtonTextColor(@NonNull Context activityContext, final AlertDialog dialog, final Bundle args, final boolean needsColorOverride) {
    return new DialogInterface.OnShowListener() {
      @Override
      public void onShow(DialogInterface dialogInterface) {
        // change text color only if custom color is set or if spinner mode is set

        Button positiveButton = dialog.getButton(AlertDialog.BUTTON_POSITIVE);
        Button negativeButton = dialog.getButton(AlertDialog.BUTTON_NEGATIVE);
        Button neutralButton = dialog.getButton(AlertDialog.BUTTON_NEUTRAL);

        int textColorPrimary = getDefaultDialogButtonTextColor(activityContext);

        if (positiveButton != null) {
          Integer color = getButtonColor(args, POSITIVE);
          if (needsColorOverride || color != null) {
            positiveButton.setTextColor(color != null ? color : textColorPrimary);
          }
        }
        if (negativeButton != null) {
          Integer color = getButtonColor(args, NEGATIVE);
          if (needsColorOverride || color != null) {
            negativeButton.setTextColor(color != null ? color : textColorPrimary);
          }
        }
        if (neutralButton != null) {
          Integer color = getButtonColor(args, NEUTRAL);
          if (needsColorOverride || color != null) {
            neutralButton.setTextColor(color != null ? color : textColorPrimary);
          }
        }
      }
    };
	}

  public static Integer getButtonColor(final Bundle args, String buttonKey) {
    Bundle buttons = args.getBundle(RNConstants.ARG_DIALOG_BUTTONS);
    if (buttons == null) {
      return null;
    }
    Bundle buttonParams = buttons.getBundle(buttonKey);
    if (buttonParams == null) {
      return null;
    }
    // yes, this cast is safe because the color is passed as int from JS
    int color = (int) buttonParams.getDouble(TEXT_COLOR, Color.TRANSPARENT);
    if (color == Color.TRANSPARENT) {
      return null;
    }
    return color;
  }

  public static RNTimePickerDisplay getDisplayTime(Bundle args) {
    RNTimePickerDisplay display = RNTimePickerDisplay.DEFAULT;
    if (args != null && args.getString(RNConstants.ARG_DISPLAY, null) != null) {
      display = RNTimePickerDisplay.valueOf(args.getString(RNConstants.ARG_DISPLAY).toUpperCase(Locale.US));
    }
    return display;
  }

  public static RNDatePickerDisplay getDisplayDate(Bundle args) {
    RNDatePickerDisplay display = RNDatePickerDisplay.DEFAULT;
    if (args != null && args.getString(RNConstants.ARG_DISPLAY, null) != null) {
      display = RNDatePickerDisplay.valueOf(args.getString(RNConstants.ARG_DISPLAY).toUpperCase(Locale.US));
    }
    return display;
  }

  public static void setButtonTitles(@NonNull Bundle args, AlertDialog dialog, DialogInterface.OnClickListener onNeutralButtonActionListener) {
    Bundle buttons = args.getBundle(RNConstants.ARG_DIALOG_BUTTONS);
    if (buttons == null) {
      return;
    }
    Bundle neutralButton = buttons.getBundle(NEUTRAL);
    Bundle positiveButton = buttons.getBundle(POSITIVE);
    Bundle negativeButton = buttons.getBundle(NEGATIVE);
    if (neutralButton != null && neutralButton.getString(LABEL) != null) {
      dialog.setButton(DialogInterface.BUTTON_NEUTRAL, neutralButton.getString(LABEL), onNeutralButtonActionListener);
    }
    if (positiveButton != null && positiveButton.getString(LABEL) != null) {
      dialog.setButton(DialogInterface.BUTTON_POSITIVE, positiveButton.getString(LABEL), (DialogInterface.OnClickListener) dialog);
    }
    if (negativeButton != null && negativeButton.getString(LABEL) != null) {
      dialog.setButton(DialogInterface.BUTTON_NEGATIVE, negativeButton.getString(LABEL), (DialogInterface.OnClickListener) dialog);
    }
  }
}
