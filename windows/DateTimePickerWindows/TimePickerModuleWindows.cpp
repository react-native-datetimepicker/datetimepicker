// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

#include "pch.h"
#include "TimePickerModuleWindows.h"

#include <winrt/Microsoft.ReactNative.Xaml.h>
#include <winrt/Microsoft.UI.Xaml.h>

namespace winrt::DateTimePicker {

void TimePickerModule::Initialize(winrt::Microsoft::ReactNative::ReactContext const &reactContext) noexcept {
  m_reactContext = reactContext;
}

void TimePickerModule::Open(ReactNativeSpecs::TimePickerModuleWindowsSpec_TimePickerOpenParams &&params,
                            winrt::Microsoft::ReactNative::ReactPromise<ReactNativeSpecs::TimePickerModuleWindowsSpec_TimePickerResult> promise) noexcept {
  // Ensure XAML is initialized
  winrt::Microsoft::ReactNative::Xaml::implementation::XamlApplication::EnsureCreated();

  // Clean up any existing picker
  CleanupPicker();

  // Store the promise
  m_currentPromise = promise;

  // Create the TimePicker
  m_timePickerControl = winrt::Microsoft::UI::Xaml::Controls::TimePicker{};

  // Set properties from params
  if (params.is24Hour.has_value()) {
    m_timePickerControl.ClockIdentifier(params.is24Hour.value() ? L"24HourClock" : L"12HourClock");
  }

  if (params.minuteInterval.has_value()) {
    m_timePickerControl.MinuteIncrement(static_cast<int32_t>(params.minuteInterval.value()));
  }

  if (params.selectedTime.has_value()) {
    // Convert timestamp (milliseconds since midnight) to TimeSpan
    int64_t totalMilliseconds = static_cast<int64_t>(params.selectedTime.value());
    int64_t totalSeconds = totalMilliseconds / 1000;
    int32_t hour = static_cast<int32_t>((totalSeconds / 3600) % 24);
    int32_t minute = static_cast<int32_t>((totalSeconds % 3600) / 60);
    
    winrt::Windows::Foundation::TimeSpan timeSpan{};
    timeSpan.Duration = (hour * 3600LL + minute * 60LL) * 10000000LL; // Convert to 100-nanosecond intervals
    m_timePickerControl.Time(timeSpan);
  }

  // Register event handler for time changed
  m_timeChangedRevoker = m_timePickerControl.TimeChanged(winrt::auto_revoke,
      [this](auto const& /*sender*/, auto const& args) {
        if (m_currentPromise) {
          auto timeSpan = args.NewTime();
          
          // Convert TimeSpan to hours and minutes
          int64_t totalSeconds = timeSpan.Duration / 10000000LL; // Convert from 100-nanosecond intervals
          int32_t hour = static_cast<int32_t>(totalSeconds / 3600);
          int32_t minute = static_cast<int32_t>((totalSeconds % 3600) / 60);

          ReactNativeSpecs::TimePickerModuleWindowsSpec_TimePickerResult result;
          result.action = "timeSetAction";
          result.hour = hour;
          result.minute = minute;

          m_currentPromise.Resolve(result);
          m_currentPromise = nullptr;
          
          // Clean up the picker after resolving
          CleanupPicker();
        }
      });

  // Note: Similar to DatePicker, a full implementation would show this in a
  // ContentDialog or Flyout. For now, this is a simplified version.
}

void TimePickerModule::Dismiss(winrt::Microsoft::ReactNative::ReactPromise<bool> promise) noexcept {
  if (m_currentPromise) {
    // Resolve the current picker promise with dismissed action
    ReactNativeSpecs::TimePickerModuleWindowsSpec_TimePickerResult result;
    result.action = "dismissedAction";
    result.hour = 0;
    result.minute = 0;

    m_currentPromise.Resolve(result);
    m_currentPromise = nullptr;
  }

  CleanupPicker();
  promise.Resolve(true);
}

void TimePickerModule::CleanupPicker() {
  if (m_timePickerControl) {
    m_timeChangedRevoker.revoke();
    m_timePickerControl = nullptr;
  }
}

} // namespace winrt::DateTimePicker
