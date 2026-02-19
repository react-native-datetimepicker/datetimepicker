// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// TimePickerModule: TurboModule implementation for imperative time picker API
// This is NOT the Fabric component - see TimePickerFabric.cpp for declarative component
// This provides DateTimePickerWindows.open() imperative API for time selection

#include "pch.h"
#include "TimePickerModuleWindows.h"

#include <winrt/Microsoft.ReactNative.Xaml.h>
#include <winrt/Microsoft.UI.Xaml.h>

namespace winrt::DateTimePicker {

void TimePickerModule::Initialize(winrt::Microsoft::ReactNative::ReactContext const &reactContext) noexcept {
  m_reactContext = reactContext;
}

// Called from JavaScript via DateTimePickerWindows.open() TurboModule API
// Example usage in JS:
//   import { DateTimePickerWindows } from '@react-native-community/datetimepicker';
//   DateTimePickerWindows.open({
//     value: new Date(),
//     mode: 'time',
//     is24Hour: true,
//     onChange: (event, time) => { ... }
//   });
// See: src/DateTimePickerWindows.windows.js and docs/windows-xaml-support.md
void TimePickerModule::Open(ReactNativeSpecs::TimePickerModuleWindowsSpec_TimePickerOpenParams &&params,
                            winrt::Microsoft::ReactNative::ReactPromise<ReactNativeSpecs::TimePickerModuleWindowsSpec_TimePickerResult> promise) noexcept {
  // Store the promise
  m_currentPromise = promise;

  // Create and open the time picker component
  // Direct assignment automatically destroys any existing picker
  m_timePickerComponent = std::make_unique<Components::TimePickerComponent>();
  m_timePickerComponent->Open(params,
      [this](const int32_t hour, const int32_t minute) {
        if (m_currentPromise) {
          ReactNativeSpecs::TimePickerModuleWindowsSpec_TimePickerResult result;
          result.action = "timeSetAction";
          result.hour = hour;
          result.minute = minute;

          m_currentPromise.Resolve(result);
          m_currentPromise = nullptr;
          
          // Clean up the picker after resolving
          m_timePickerComponent.reset();
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

  // Clean up component
  m_timePickerComponent.reset();
  promise.Resolve(true);
}

} // namespace winrt::DateTimePicker

} // namespace winrt::DateTimePicker
