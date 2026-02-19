// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

#pragma once

#include "NativeModules.h"

namespace ReactNativeSpecs {

// DatePicker TurboModule Specs
REACT_STRUCT(DatePickerModuleWindowsSpec_DatePickerOpenParams)
struct DatePickerModuleWindowsSpec_DatePickerOpenParams {
  REACT_FIELD(dayOfWeekFormat)
  std::optional<std::string> dayOfWeekFormat;

  REACT_FIELD(dateFormat)
  std::optional<std::string> dateFormat;

  REACT_FIELD(firstDayOfWeek)
  std::optional<int32_t> firstDayOfWeek;

  REACT_FIELD(maximumDate)
  std::optional<double> maximumDate;

  REACT_FIELD(minimumDate)
  std::optional<double> minimumDate;

  REACT_FIELD(placeholderText)
  std::optional<std::string> placeholderText;

  REACT_FIELD(testID)
  std::optional<std::string> testID;

  REACT_FIELD(timeZoneOffsetInSeconds)
  std::optional<double> timeZoneOffsetInSeconds;
};

REACT_STRUCT(DatePickerModuleWindowsSpec_DatePickerResult)
struct DatePickerModuleWindowsSpec_DatePickerResult {
  REACT_FIELD(action)
  std::string action;

  REACT_FIELD(timestamp)
  double timestamp;

  REACT_FIELD(utcOffset)
  int32_t utcOffset;
};

REACT_MODULE(DatePickerModuleWindows)
struct DatePickerModuleWindowsSpec : winrt::Microsoft::ReactNative::TurboModuleSpec {
  static constexpr auto methods = std::tuple{
      Method<DatePickerModuleWindowsSpec_DatePickerResult(DatePickerModuleWindowsSpec_DatePickerOpenParams) noexcept>{0, L"open"},
      Method<bool() noexcept>{1, L"dismiss"},
  };

  template <class TModule>
  static constexpr void ValidateModule() noexcept {
    constexpr auto methodCheckResults = CheckMethods<TModule, DatePickerModuleWindowsSpec>();

    REACT_SHOW_METHOD_SPEC_ERRORS(
        0,
        "open",
        "    REACT_METHOD(Open, L\"open\")\n"
        "    void Open(DatePickerModuleWindowsSpec_DatePickerOpenParams &&params, ReactPromise<DatePickerModuleWindowsSpec_DatePickerResult> promise) noexcept;\n");

    REACT_SHOW_METHOD_SPEC_ERRORS(
        1,
        "dismiss",
        "    REACT_METHOD(Dismiss, L\"dismiss\")\n"
        "    void Dismiss(ReactPromise<bool> promise) noexcept;\n");
  }
};

// TimePicker TurboModule Specs
REACT_STRUCT(TimePickerModuleWindowsSpec_TimePickerOpenParams)
struct TimePickerModuleWindowsSpec_TimePickerOpenParams {
  REACT_FIELD(is24Hour)
  std::optional<bool> is24Hour;

  REACT_FIELD(minuteInterval)
  std::optional<double> minuteInterval;

  REACT_FIELD(selectedTime)
  std::optional<double> selectedTime;

  REACT_FIELD(testID)
  std::optional<std::string> testID;
};

REACT_STRUCT(TimePickerModuleWindowsSpec_TimePickerResult)
struct TimePickerModuleWindowsSpec_TimePickerResult {
  REACT_FIELD(action)
  std::string action;

  REACT_FIELD(hour)
  int32_t hour;

  REACT_FIELD(minute)
  int32_t minute;
};

REACT_MODULE(TimePickerModuleWindows)
struct TimePickerModuleWindowsSpec : winrt::Microsoft::ReactNative::TurboModuleSpec {
  static constexpr auto methods = std::tuple{
      Method<TimePickerModuleWindowsSpec_TimePickerResult(TimePickerModuleWindowsSpec_TimePickerOpenParams) noexcept>{0, L"open"},
      Method<bool() noexcept>{1, L"dismiss"},
  };

  template <class TModule>
  static constexpr void ValidateModule() noexcept {
    constexpr auto methodCheckResults = CheckMethods<TModule, TimePickerModuleWindowsSpec>();

    REACT_SHOW_METHOD_SPEC_ERRORS(
        0,
        "open",
        "    REACT_METHOD(Open, L\"open\")\n"
        "    void Open(TimePickerModuleWindowsSpec_TimePickerOpenParams &&params, ReactPromise<TimePickerModuleWindowsSpec_TimePickerResult> promise) noexcept;\n");

    REACT_SHOW_METHOD_SPEC_ERRORS(
        1,
        "dismiss",
        "    REACT_METHOD(Dismiss, L\"dismiss\")\n"
        "    void Dismiss(ReactPromise<bool> promise) noexcept;\n");
  }
};

} // namespace ReactNativeSpecs
