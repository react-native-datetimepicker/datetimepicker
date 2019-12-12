package com.reactcommunity.rndatetimepicker;

import java.util.Arrays;

/**
 * Time picker minutes' intervals.
 * NOTE: any interval except for '1' and '5' only compatible with {@link RNTimePickerDisplay.SPINNER}
 */
public final class RNMinuteIntervals {
  private final static Integer[] MinuteIntervals = new Integer[]{1, 5, 10, 15, 20, 30};

  public static boolean isValid(Integer interval) {
    return Arrays.asList(MinuteIntervals).contains(interval);
  }

  public static boolean isRadialPickerCompatible(Integer interval) {
    return MinuteIntervals[0].equals(interval) || MinuteIntervals[1].equals(interval);
  }
}