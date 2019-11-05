package com.reactcommunity.rndatetimepicker;

import java.util.List;
import java.util.Arrays;

/**
 * Time picker minutes' intervals.
 */
public final class RNMinuteIntervals {
    private final static List<Integer> mMinuteIntervals = Arrays.asList(1, 5, 10, 15, 20, 30);

    public static boolean isValid(Integer interval){
        return mMinuteIntervals.contains(interval);
    }
}