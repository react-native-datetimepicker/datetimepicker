// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

#pragma once

#include "NativeModules.h"
#include <winrt/Microsoft.UI.Xaml.Controls.h>
#include <functional>

namespace winrt::DateTimePicker::Components {

/// <summary>
/// Encapsulates TimePicker control and its configuration.
/// Separates UI concerns from module logic.
/// </summary>
class TimePickerComponent {
public:
  using TimeChangedCallback = std::function<void(int32_t hour, int32_t minute)>;
  
  TimePickerComponent();

  /// <summary>
  /// Opens and configures the time picker with the provided parameters and callback.
  /// Encapsulates configuration and event handler setup.
  /// </summary>
  void Open(const ReactNativeSpecs::TimePickerModuleWindowsSpec_TimePickerOpenParams& params,
            TimeChangedCallback callback);

  /// <summary>
  /// Gets the underlying XAML control.
  /// </summary>
  winrt::Microsoft::UI::Xaml::Controls::TimePicker GetControl() const;

private:
  winrt::Microsoft::UI::Xaml::Controls::TimePicker m_control{nullptr};
  winrt::Microsoft::UI::Xaml::Controls::TimePicker::TimeChanged_revoker m_timeChangedRevoker;
  TimeChangedCallback m_timeChangedCallback;

  void OnTimeChanged(winrt::Windows::Foundation::IInspectable const& sender,
                     winrt::Microsoft::UI::Xaml::Controls::TimePickerValueChangedEventArgs const& args);
};

} // namespace winrt::DateTimePicker::Components
