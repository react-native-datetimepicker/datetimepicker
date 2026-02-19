// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

#include "pch.h"
#include "TimePickerComponent.h"

namespace winrt::DateTimePicker::Components {

TimePickerComponent::TimePickerComponent()
  : m_control(winrt::Microsoft::UI::Xaml::Controls::TimePicker{}) {
}

void TimePickerComponent::Open(
    const ReactNativeSpecs::TimePickerModuleWindowsSpec_TimePickerOpenParams& params,
    TimeChangedCallback callback) {

  // Store callback
  m_timeChangedCallback = std::move(callback);

  // Set properties from params
  if (auto is24Hour = params.is24Hour) {
    m_control.ClockIdentifier(*is24Hour ? L"24HourClock" : L"12HourClock");
  }

  if (auto minuteInterval = params.minuteInterval) {
    m_control.MinuteIncrement(static_cast<int32_t>(*minuteInterval));
  }

  if (auto selectedTime = params.selectedTime) {
    // Convert timestamp (milliseconds since midnight) to TimeSpan
    const int64_t totalMilliseconds = static_cast<int64_t>(*selectedTime);
    const int64_t totalSeconds = totalMilliseconds / 1000;
    const int32_t hour = static_cast<int32_t>((totalSeconds / 3600) % 24);
    const int32_t minute = static_cast<int32_t>((totalSeconds % 3600) / 60);
    
    winrt::Windows::Foundation::TimeSpan timeSpan{};
    timeSpan.Duration = (hour * 3600LL + minute * 60LL) * 10000000LL; // Convert to 100-nanosecond intervals
    m_control.Time(timeSpan);
  }

  // Register event handler
  m_timeChangedRevoker = m_control.TimeChanged(winrt::auto_revoke,
      [this](auto const& sender, auto const& args) {
        OnTimeChanged(sender, args);
      });
}

winrt::Microsoft::UI::Xaml::Controls::TimePicker TimePickerComponent::GetControl() const {
  return m_control;
}

void TimePickerComponent::OnTimeChanged(
    winrt::Windows::Foundation::IInspectable const& /*sender*/,
    winrt::Microsoft::UI::Xaml::Controls::TimePickerValueChangedEventArgs const& args) {
  
  if (m_timeChangedCallback) {
    const auto timeSpan = args.NewTime();
    
    // Convert TimeSpan to hours and minutes
    const int64_t totalSeconds = timeSpan.Duration / 10000000LL; // Convert from 100-nanosecond intervals
    const int32_t hour = static_cast<int32_t>(totalSeconds / 3600);
    const int32_t minute = static_cast<int32_t>((totalSeconds % 3600) / 60);

    m_timeChangedCallback(hour, minute);
  }
}

} // namespace winrt::DateTimePicker::Components
