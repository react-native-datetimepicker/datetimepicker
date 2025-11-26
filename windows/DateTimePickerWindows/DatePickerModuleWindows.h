// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

#pragma once

#include "NativeModules.h"
#include <winrt/Microsoft.UI.Xaml.Controls.h>
#include <winrt/Windows.Globalization.h>

namespace winrt::DateTimePicker {

REACT_MODULE(DatePickerModule)
struct DatePickerModule {
  using ModuleSpec = ReactNativeSpecs::DatePickerModuleWindowsSpec;

  REACT_INIT(Initialize)
  void Initialize(winrt::Microsoft::ReactNative::ReactContext const &reactContext) noexcept;

  REACT_METHOD(Open, L"open")
  void Open(ReactNativeSpecs::DatePickerModuleWindowsSpec_DatePickerOpenParams &&params,
            winrt::Microsoft::ReactNative::ReactPromise<ReactNativeSpecs::DatePickerModuleWindowsSpec_DatePickerResult> promise) noexcept;

  REACT_METHOD(Dismiss, L"dismiss")
  void Dismiss(winrt::Microsoft::ReactNative::ReactPromise<bool> promise) noexcept;

 private:
  winrt::Microsoft::ReactNative::ReactContext m_reactContext{nullptr};
  winrt::Microsoft::UI::Xaml::Controls::CalendarDatePicker m_datePickerControl{nullptr};
  winrt::Microsoft::ReactNative::ReactPromise<ReactNativeSpecs::DatePickerModuleWindowsSpec_DatePickerResult> m_currentPromise{nullptr};
  
  // Event handlers
  winrt::Microsoft::UI::Xaml::Controls::CalendarDatePicker::DateChanged_revoker m_dateChangedRevoker;

  // Helper methods
  winrt::Windows::Foundation::DateTime DateTimeFrom(int64_t timeInMilliseconds, int64_t timeZoneOffsetInSeconds);
  int64_t DateTimeToMilliseconds(winrt::Windows::Foundation::DateTime dateTime, int64_t timeZoneOffsetInSeconds);
  void CleanupPicker();
};

} // namespace winrt::DateTimePicker
