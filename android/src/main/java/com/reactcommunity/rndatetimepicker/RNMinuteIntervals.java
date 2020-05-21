package com.reactcommunity.rndatetimepicker;

import java.util.Arrays;

/**
 * Time picker minutes' intervals.
 */
public final class RNMinuteIntervals {
  private final static Integer[] MinuteIntervals = new Integer[]{1, 5, 10, 15, 20, 30};

  public static boolean isValid(Integer interval) {
    return Arrays.asList(MinuteIntervals).contains(interval);
  }
}