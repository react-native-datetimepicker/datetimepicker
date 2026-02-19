// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

#pragma once

#include "NativeModules.h"
#include "DatePickerComponent.h"
#include <memory>

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
  std::unique_ptr<Components::DatePickerComponent> m_datePickerComponent;
  winrt::Microsoft::ReactNative::ReactPromise<ReactNativeSpecs::DatePickerModuleWindowsSpec_DatePickerResult> m_currentPromise{nullptr};
};

} // namespace winrt::DateTimePicker
