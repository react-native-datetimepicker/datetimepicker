// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

#pragma once

#if defined(RNW_NEW_ARCH)

#include <winrt/Microsoft.UI.Xaml.Controls.h>
#include <winrt/Windows.Foundation.h>
#include <winrt/Microsoft.ReactNative.h>
#include <winrt/Microsoft.ReactNative.Composition.h>

namespace winrt::DateTimePicker {

// TimePickerProps struct for the TimePicker component
// Since TimePicker doesn't have a codegen spec file, we define it manually
struct TimePickerProps : winrt::implements<TimePickerProps, winrt::Microsoft::ReactNative::IComponentProps> {
  TimePickerProps(winrt::Microsoft::ReactNative::ViewProps props, const winrt::Microsoft::ReactNative::IComponentProps& cloneFrom)
    : ViewProps(props)
  {
    if (cloneFrom) {
      auto cloneFromProps = cloneFrom.as<TimePickerProps>();
      selectedTime = cloneFromProps->selectedTime;
      is24Hour = cloneFromProps->is24Hour;
      minuteInterval = cloneFromProps->minuteInterval;
    }
  }

  void SetProp(uint32_t hash, winrt::hstring propName, winrt::Microsoft::ReactNative::IJSValueReader value) noexcept {
    // Handle prop reading here
  }

  std::optional<int64_t> selectedTime;
  std::optional<bool> is24Hour;
  std::optional<int32_t> minuteInterval;

  const winrt::Microsoft::ReactNative::ViewProps ViewProps;
};

// TimePickerComponentView implements the Fabric architecture for TimePicker
// using XAML TimePicker hosted in a XamlIsland
struct TimePickerComponentView : public winrt::implements<TimePickerComponentView, winrt::IInspectable> {
  void InitializeContentIsland(
      const winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView &islandView) noexcept;

  void RegisterEvents();

  void UpdateProps(
      const winrt::Microsoft::ReactNative::ComponentView &view,
      const winrt::com_ptr<TimePickerProps> &newProps,
      const winrt::com_ptr<TimePickerProps> &oldProps) noexcept;

  void UpdateEventEmitter(const winrt::Microsoft::ReactNative::EventEmitter &eventEmitter) noexcept;

private:
  winrt::Microsoft::UI::Xaml::XamlIsland m_xamlIsland{nullptr};
  winrt::Microsoft::UI::Xaml::Controls::TimePicker m_timePicker{nullptr};
  winrt::Microsoft::UI::Xaml::Controls::TimePicker::TimeChanged_revoker m_timeChangedRevoker;
  winrt::Microsoft::ReactNative::EventEmitter m_eventEmitter{nullptr};
};

} // namespace winrt::DateTimePicker

// Registers the TimePicker component view with the React Native package builder
void RegisterTimePickerComponentView(winrt::Microsoft::ReactNative::IReactPackageBuilder const &packageBuilder);

#endif // defined(RNW_NEW_ARCH)
