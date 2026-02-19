// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

#pragma once

#include "NativeModules.h"
#include "NativeModulesWindows.g.h"
#include "TimePickerComponent.h"
#include <memory>

namespace winrt::DateTimePicker {

REACT_MODULE(TimePickerModule)
struct TimePickerModule {
  using ModuleSpec = ReactNativeSpecs::TimePickerModuleWindowsSpec;

  REACT_INIT(Initialize)
  void Initialize(winrt::Microsoft::ReactNative::ReactContext const &reactContext) noexcept;

  REACT_METHOD(Open, L"open")
  void Open(ReactNativeSpecs::TimePickerModuleWindowsSpec_TimePickerOpenParams &&params,
            winrt::Microsoft::ReactNative::ReactPromise<ReactNativeSpecs::TimePickerModuleWindowsSpec_TimePickerResult> promise) noexcept;

  REACT_METHOD(Dismiss, L"dismiss")
  void Dismiss(winrt::Microsoft::ReactNative::ReactPromise<bool> promise) noexcept;

 private:
  winrt::Microsoft::ReactNative::ReactContext m_reactContext{nullptr};
  std::unique_ptr<Components::TimePickerComponent> m_timePickerComponent;
  winrt::Microsoft::ReactNative::ReactPromise<ReactNativeSpecs::TimePickerModuleWindowsSpec_TimePickerResult> m_currentPromise{nullptr};
};

} // namespace winrt::DateTimePicker
