// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// DatePickerModule: TurboModule implementation for imperative date picker API
// This is NOT the Fabric component - see DateTimePickerFabric.cpp for declarative <DateTimePicker/> component
// This provides DateTimePickerWindows.open() imperative API similar to Android's DateTimePickerAndroid

#include "pch.h"
#include "DatePickerModuleWindows.h"

#include <winrt/Microsoft.ReactNative.Xaml.h>
#include <winrt/Microsoft.UI.Xaml.h>

namespace winrt::DateTimePicker {

void DatePickerModule::Initialize(winrt::Microsoft::ReactNative::ReactContext const &reactContext) noexcept {
  m_reactContext = reactContext;
}

// Called from JavaScript via DateTimePickerWindows.open() TurboModule API
// Example usage in JS:
//   import { DateTimePickerWindows } from '@react-native-community/datetimepicker';
//   DateTimePickerWindows.open({
//     value: new Date(),
//     mode: 'date',
//     minimumDate: new Date(2020, 0, 1),
//     onChange: (event, date) => { ... }
//   });
// See: src/DateTimePickerWindows.windows.js and docs/windows-xaml-support.md
void DatePickerModule::Open(ReactNativeSpecs::DatePickerModuleWindowsSpec_DatePickerOpenParams &&params,
                            winrt::Microsoft::ReactNative::ReactPromise<ReactNativeSpecs::DatePickerModuleWindowsSpec_DatePickerResult> promise) noexcept {
  // Store the promise
  m_currentPromise = promise;

  // Create and open the date picker component
  // Direct assignment automatically destroys any existing picker
  // Note: This is separate from the Fabric component (DateTimePickerFabric.cpp)
  // This component is used by the TurboModule for imperative API calls
  m_datePickerComponent = std::make_unique<Components::DatePickerComponent>();
  m_datePickerComponent->Open(params,
      [this](const int64_t timestamp, const int32_t utcOffset) {
        if (m_currentPromise) {
          ReactNativeSpecs::DatePickerModuleWindowsSpec_DatePickerResult result;
          result.action = "dateSetAction";
          result.timestamp = static_cast<double>(timestamp);
          result.utcOffset = utcOffset;

          m_currentPromise.Resolve(result);
          m_currentPromise = nullptr;
          
          // Clean up the picker after resolving
          m_datePickerComponent.reset();
        }
      });

  // Note: This is a simplified implementation. A full implementation would:
  // 1. Create a ContentDialog or Popup
  // 2. Add the CalendarDatePicker to it
  // 3. Show the dialog/popup
  // 4. Handle OK/Cancel buttons
  
  // For now, the component is ready and waiting for user interaction
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

  // Clean up component
  m_datePickerComponent.reset();
  promise.Resolve(true);
}

} // namespace winrt::DateTimePicker
