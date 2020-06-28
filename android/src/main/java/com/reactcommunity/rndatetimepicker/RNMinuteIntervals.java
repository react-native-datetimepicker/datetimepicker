package com.reactcommunity.rndatetimepicker;


public final class RNMinuteIntervals {

  public static boolean isValid(int interval) {
    return 60 % interval == 0 && interval  >= 1 && interval <= 30;
  }
}