package com.reactcommunity.rndatetimepicker;


/**
 * Time picker minutes' intervals.
 */
public final class RNMinuteIntervals {

  public static boolean isValid(int interval) {
    return 60 % interval == 0 && interval <= 30;
  }
}