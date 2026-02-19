// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

#pragma once

#include "NativeModules.h"
#include <winrt/Microsoft.UI.Xaml.Controls.h>
#include <winrt/Windows.Globalization.h>
#include <functional>

namespace winrt::DateTimePicker::Components {

/// <summary>
/// Encapsulates CalendarDatePicker control and its configuration.
/// Separates UI concerns from module logic.
/// </summary>
class DatePickerComponent {
public:
  using DateChangedCallback = std::function<void(int64_t timestamp, int32_t utcOffset)>;
  
  DatePickerComponent();

  /// <summary>
  /// Opens and configures the date picker with the provided parameters and callback.
  /// Encapsulates configuration and event handler setup.
  /// </summary>
  void Open(const ReactNativeSpecs::DatePickerModuleWindowsSpec_DatePickerOpenParams& params, 
            DateChangedCallback callback);

  /// <summary>
  /// Gets the underlying XAML control.
  /// </summary>
  winrt::Microsoft::UI::Xaml::Controls::CalendarDatePicker GetControl() const;

private:
  winrt::Microsoft::UI::Xaml::Controls::CalendarDatePicker m_control{nullptr};
  winrt::Microsoft::UI::Xaml::Controls::CalendarDatePicker::DateChanged_revoker m_dateChangedRevoker;
  DateChangedCallback m_dateChangedCallback;
  int64_t m_timeZoneOffsetInSeconds{0};

  void OnDateChanged(winrt::Windows::Foundation::IInspectable const& sender,
                     winrt::Microsoft::UI::Xaml::Controls::CalendarDatePickerDateChangedEventArgs const& args);
};

} // namespace winrt::DateTimePicker::Components
