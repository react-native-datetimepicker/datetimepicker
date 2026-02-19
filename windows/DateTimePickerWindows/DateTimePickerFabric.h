// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

#pragma once

#if defined(RNW_NEW_ARCH)

#include "codegen/react/components/DateTimePicker/DateTimePicker.g.h"

#include <winrt/Microsoft.UI.Xaml.Controls.h>
#include <winrt/Windows.Globalization.h>
#include <winrt/Microsoft.ReactNative.Composition.h>

namespace winrt::DateTimePicker {

// DateTimePickerComponentView implements the Fabric architecture for DateTimePicker
// using XAML CalendarDatePicker hosted in a XamlIsland
struct DateTimePickerComponentView : public winrt::implements<DateTimePickerComponentView, winrt::IInspectable>,
                                     Codegen::BaseDateTimePicker<DateTimePickerComponentView> {
  void InitializeContentIsland(
      const winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView &islandView) noexcept;

  void RegisterEvents();

  void UpdateProps(
      const winrt::Microsoft::ReactNative::ComponentView &view,
      const winrt::com_ptr<Codegen::DateTimePickerProps> &newProps,
      const winrt::com_ptr<Codegen::DateTimePickerProps> &oldProps) noexcept override;

private:
  winrt::Microsoft::UI::Xaml::XamlIsland m_xamlIsland{nullptr};
  winrt::Microsoft::UI::Xaml::Controls::CalendarDatePicker m_calendarDatePicker{nullptr};
  winrt::Microsoft::UI::Xaml::Controls::CalendarDatePicker::DateChanged_revoker m_dateChangedRevoker;
  int64_t m_timeZoneOffsetInSeconds = 0;
};

} // namespace winrt::DateTimePicker

// Registers the DateTimePicker component view with the React Native package builder
void RegisterDateTimePickerComponentView(winrt::Microsoft::ReactNative::IReactPackageBuilder const &packageBuilder);

#endif // defined(RNW_NEW_ARCH)
