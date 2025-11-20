// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

#include "pch.h"
#include "DatePickerModuleWindows.h"

#include <winrt/Microsoft.ReactNative.Xaml.h>
#include <winrt/Microsoft.UI.Xaml.h>

namespace winrt::DateTimePicker {

void DatePickerModule::Initialize(winrt::Microsoft::ReactNative::ReactContext const &reactContext) noexcept {
  m_reactContext = reactContext;
}

void DatePickerModule::Open(ReactNativeSpecs::DatePickerModuleWindowsSpec_DatePickerOpenParams &&params,
                            winrt::Microsoft::ReactNative::ReactPromise<ReactNativeSpecs::DatePickerModuleWindowsSpec_DatePickerResult> promise) noexcept {
  // Ensure XAML is initialized
  winrt::Microsoft::ReactNative::Xaml::implementation::XamlApplication::EnsureCreated();

  // Clean up any existing picker
  CleanupPicker();

  // Store the promise
  m_currentPromise = promise;

  // Store timezone offset
  if (params.timeZoneOffsetInSeconds.has_value()) {
    m_timeZoneOffsetInSeconds = static_cast<int64_t>(params.timeZoneOffsetInSeconds.value());
  } else {
    m_timeZoneOffsetInSeconds = 0;
  }

  // Create the CalendarDatePicker
  m_datePickerControl = winrt::Microsoft::UI::Xaml::Controls::CalendarDatePicker{};

  // Set properties from params
  if (params.dayOfWeekFormat.has_value()) {
    m_datePickerControl.DayOfWeekFormat(winrt::to_hstring(params.dayOfWeekFormat.value()));
  }

  if (params.dateFormat.has_value()) {
    m_datePickerControl.DateFormat(winrt::to_hstring(params.dateFormat.value()));
  }

  if (params.firstDayOfWeek.has_value()) {
    m_datePickerControl.FirstDayOfWeek(
        static_cast<winrt::Windows::Globalization::DayOfWeek>(params.firstDayOfWeek.value()));
  }

  if (params.minimumDate.has_value()) {
    m_datePickerControl.MinDate(DateTimeFrom(
        static_cast<int64_t>(params.minimumDate.value()), m_timeZoneOffsetInSeconds));
  }

  if (params.maximumDate.has_value()) {
    m_datePickerControl.MaxDate(DateTimeFrom(
        static_cast<int64_t>(params.maximumDate.value()), m_timeZoneOffsetInSeconds));
  }

  if (params.placeholderText.has_value()) {
    m_datePickerControl.PlaceholderText(winrt::to_hstring(params.placeholderText.value()));
  }

  // Register event handler for date changed
  m_dateChangedRevoker = m_datePickerControl.DateChanged(winrt::auto_revoke,
      [this](auto const& /*sender*/, auto const& args) {
        if (m_currentPromise && args.NewDate() != nullptr) {
          auto newDate = args.NewDate().Value();
          auto timeInMilliseconds = DateTimeToMilliseconds(newDate, m_timeZoneOffsetInSeconds);

          ReactNativeSpecs::DatePickerModuleWindowsSpec_DatePickerResult result;
          result.action = "dateSetAction";
          result.timestamp = static_cast<double>(timeInMilliseconds);
          result.utcOffset = static_cast<int32_t>(m_timeZoneOffsetInSeconds);

          m_currentPromise.Resolve(result);
          m_currentPromise = nullptr;
          
          // Clean up the picker after resolving
          CleanupPicker();
        }
      });

  // For Windows, we need to show the picker programmatically
  // Since CalendarDatePicker doesn't have a programmatic open method,
  // we'll need to add it to a popup or flyout
  // For simplicity, we'll resolve immediately with the current date if set
  // In a real implementation, you'd want to show this in a ContentDialog or Flyout
  
  // Note: This is a simplified implementation. A full implementation would:
  // 1. Create a ContentDialog or Popup
  // 2. Add the CalendarDatePicker to it
  // 3. Show the dialog/popup
  // 4. Handle OK/Cancel buttons
  
  // For now, we'll just focus the control and wait for user interaction
  // The actual UI integration would depend on your app's structure
}

void DatePickerModule::Dismiss(winrt::Microsoft::ReactNative::ReactPromise<bool> promise) noexcept {
  if (m_currentPromise) {
    // Resolve the current picker promise with dismissed action
    ReactNativeSpecs::DatePickerModuleWindowsSpec_DatePickerResult result;
    result.action = "dismissedAction";
    result.timestamp = 0;
    result.utcOffset = 0;

    m_currentPromise.Resolve(result);
    m_currentPromise = nullptr;
  }

  CleanupPicker();
  promise.Resolve(true);
}

winrt::Windows::Foundation::DateTime DatePickerModule::DateTimeFrom(int64_t timeInMilliseconds, int64_t timeZoneOffsetInSeconds) {
  const auto timeInSeconds = timeInMilliseconds / 1000;
  time_t ttWithTimeZoneOffset = static_cast<time_t>(timeInSeconds) + timeZoneOffsetInSeconds;
  winrt::Windows::Foundation::DateTime dateTime = winrt::clock::from_time_t(ttWithTimeZoneOffset);
  return dateTime;
}

int64_t DatePickerModule::DateTimeToMilliseconds(winrt::Windows::Foundation::DateTime dateTime, int64_t timeZoneOffsetInSeconds) {
  const time_t ttInSeconds = winrt::clock::to_time_t(dateTime);
  auto timeInUtc = ttInSeconds - timeZoneOffsetInSeconds;
  auto ttInMilliseconds = static_cast<int64_t>(timeInUtc) * 1000;
  return ttInMilliseconds;
}

void DatePickerModule::CleanupPicker() {
  if (m_datePickerControl) {
    m_dateChangedRevoker.revoke();
    m_datePickerControl = nullptr;
  }
}

} // namespace winrt::DateTimePicker
