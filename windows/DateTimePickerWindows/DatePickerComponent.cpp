// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

#include "pch.h"
#include "DatePickerComponent.h"
#include "DateTimeHelpers.h"

namespace winrt::DateTimePicker::Components {

DatePickerComponent::DatePickerComponent()
    : m_control{winrt::Microsoft::UI::Xaml::Controls::CalendarDatePicker{}} {
}
}

void DatePickerComponent::Open(
    const ReactNativeSpecs::DatePickerModuleWindowsSpec_DatePickerOpenParams& params,
    DateChangedCallback callback) {
  
  // Store callback
  m_dateChangedCallback = std::move(callback);
  
  // Store timezone offset
  m_timeZoneOffsetInSeconds = static_cast<int64_t>(params.timeZoneOffsetInSeconds.value_or(0));

  // Set properties from params
  if (auto dayOfWeekFormat = params.dayOfWeekFormat) {
    m_control.DayOfWeekFormat(winrt::to_hstring(*dayOfWeekFormat));
  }

  if (auto dateFormat = params.dateFormat) {
    m_control.DateFormat(winrt::to_hstring(*dateFormat));
  }

  if (auto firstDayOfWeek = params.firstDayOfWeek) {
    m_control.FirstDayOfWeek(
        static_cast<winrt::Windows::Globalization::DayOfWeek>(*firstDayOfWeek));
  }

  if (auto minimumDate = params.minimumDate) {
    m_control.MinDate(Helpers::DateTimeFrom(
        static_cast<int64_t>(*minimumDate), m_timeZoneOffsetInSeconds));
  }

  if (auto maximumDate = params.maximumDate) {
    m_control.MaxDate(Helpers::DateTimeFrom(
        static_cast<int64_t>(*maximumDate), m_timeZoneOffsetInSeconds));
  }

  if (auto placeholderText = params.placeholderText) {
    m_control.PlaceholderText(winrt::to_hstring(*placeholderText));
  }

  // Register event handler
  m_dateChangedRevoker = m_control.DateChanged(winrt::auto_revoke,
      [this](auto const& sender, auto const& args) {
        OnDateChanged(sender, args);
      });
}

winrt::Microsoft::UI::Xaml::Controls::CalendarDatePicker DatePickerComponent::GetControl() const {
  return m_control;
}

void DatePickerComponent::OnDateChanged(
    winrt::Windows::Foundation::IInspectable const& /*sender*/,
    winrt::Microsoft::UI::Xaml::Controls::CalendarDatePickerDateChangedEventArgs const& args) {
  
  if (m_dateChangedCallback && args.NewDate() != nullptr) {
    const auto newDate = args.NewDate().Value();
    const auto timeInMilliseconds = Helpers::DateTimeToMilliseconds(newDate, m_timeZoneOffsetInSeconds);
    
    m_dateChangedCallback(timeInMilliseconds, static_cast<int32_t>(m_timeZoneOffsetInSeconds));
  }
}

} // namespace winrt::DateTimePicker::Components
