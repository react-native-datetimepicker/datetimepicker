// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

#include "pch.h"

#include "DateTimePickerFabric.h"

#if defined(RNW_NEW_ARCH)

#include "codegen/react/components/DateTimePicker/DateTimePicker.g.h"

#include <winrt/Microsoft.UI.Xaml.Controls.h>
#include <winrt/Windows.Globalization.h>
#include <winrt/Microsoft.ReactNative.Xaml.h>

namespace winrt::DateTimePicker {

// DateTimePickerComponentView implements the Fabric architecture for DateTimePicker
// using XAML CalendarDatePicker hosted in a XamlIsland
struct DateTimePickerComponentView : public winrt::implements<DateTimePickerComponentView, winrt::IInspectable>,
                                     Codegen::BaseDateTimePicker<DateTimePickerComponentView> {
  void InitializeContentIsland(
      const winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView &islandView) noexcept {
    winrt::Microsoft::ReactNative::Xaml::implementation::XamlApplication::EnsureCreated();

    m_xamlIsland = winrt::Microsoft::UI::Xaml::XamlIsland{};
    m_calendarDatePicker = winrt::Microsoft::UI::Xaml::Controls::CalendarDatePicker{};
    m_xamlIsland.Content(m_calendarDatePicker);
    islandView.Connect(m_xamlIsland.ContentIsland());

    RegisterEvents();
  }

  void RegisterEvents() {
    // Register the DateChanged event handler
    m_calendarDatePicker.DateChanged([this](auto &&sender, auto &&args) {
      if (m_updating) {
        return;
      }

      if (auto emitter = EventEmitter()) {
        if (args.NewDate() != nullptr) {
          auto newDate = args.NewDate().Value();
          
          // Convert DateTime to milliseconds
          auto timeInMilliseconds = DateTimeToMilliseconds(newDate, m_timeZoneOffsetInSeconds);
          
          Codegen::DateTimePicker_OnChange eventArgs;
          eventArgs.newDate = timeInMilliseconds;
          emitter->onChange(eventArgs);
        }
      }
    });
  }

  void UpdateProps(
      const winrt::Microsoft::ReactNative::ComponentView &view,
      const winrt::com_ptr<Codegen::DateTimePickerProps> &newProps,
      const winrt::com_ptr<Codegen::DateTimePickerProps> &oldProps) noexcept override {
    Codegen::BaseDateTimePicker<DateTimePickerComponentView>::UpdateProps(view, newProps, oldProps);

    if (!newProps) {
      return;
    }

    m_updating = true;

    // Update dayOfWeekFormat
    if (newProps->dayOfWeekFormat.has_value()) {
      m_calendarDatePicker.DayOfWeekFormat(winrt::to_hstring(newProps->dayOfWeekFormat.value()));
    }

    // Update dateFormat
    if (newProps->dateFormat.has_value()) {
      m_calendarDatePicker.DateFormat(winrt::to_hstring(newProps->dateFormat.value()));
    }

    // Update firstDayOfWeek
    if (newProps->firstDayOfWeek.has_value()) {
      m_calendarDatePicker.FirstDayOfWeek(
          static_cast<winrt::Windows::Globalization::DayOfWeek>(newProps->firstDayOfWeek.value()));
    }

    // Update placeholderText
    if (newProps->placeholderText.has_value()) {
      m_calendarDatePicker.PlaceholderText(winrt::to_hstring(newProps->placeholderText.value()));
    }

    // Store timezone offset
    if (newProps->timeZoneOffsetInSeconds.has_value()) {
      m_timeZoneOffsetInSeconds = newProps->timeZoneOffsetInSeconds.value();
    } else {
      m_timeZoneOffsetInSeconds = 0;
    }

    // Update min/max dates
    if (newProps->minimumDate.has_value()) {
      m_calendarDatePicker.MinDate(DateTimeFrom(newProps->minimumDate.value(), m_timeZoneOffsetInSeconds));
    }

    if (newProps->maximumDate.has_value()) {
      m_calendarDatePicker.MaxDate(DateTimeFrom(newProps->maximumDate.value(), m_timeZoneOffsetInSeconds));
    }

    // Update selected date
    if (newProps->selectedDate.has_value()) {
      m_calendarDatePicker.Date(DateTimeFrom(newProps->selectedDate.value(), m_timeZoneOffsetInSeconds));
    }

    // Update accessibilityLabel (using Name property)
    if (newProps->accessibilityLabel.has_value()) {
      m_calendarDatePicker.Name(winrt::to_hstring(newProps->accessibilityLabel.value()));
    }

    m_updating = false;
  }

private:
  winrt::Microsoft::UI::Xaml::XamlIsland m_xamlIsland{nullptr};
  winrt::Microsoft::UI::Xaml::Controls::CalendarDatePicker m_calendarDatePicker{nullptr};
  int64_t m_timeZoneOffsetInSeconds = 0;
  bool m_updating = false;

  // Helper function to convert milliseconds timestamp to Windows DateTime
  winrt::Windows::Foundation::DateTime DateTimeFrom(int64_t timeInMilliseconds, int64_t timeZoneOffsetInSeconds) {
    const auto timeInSeconds = timeInMilliseconds / 1000;
    time_t ttWithTimeZoneOffset = static_cast<time_t>(timeInSeconds) + timeZoneOffsetInSeconds;
    winrt::Windows::Foundation::DateTime dateTime = winrt::clock::from_time_t(ttWithTimeZoneOffset);
    return dateTime;
  }

  // Helper function to convert Windows DateTime to milliseconds timestamp
  int64_t DateTimeToMilliseconds(winrt::Windows::Foundation::DateTime dateTime, int64_t timeZoneOffsetInSeconds) {
    const time_t ttInSeconds = winrt::clock::to_time_t(dateTime);
    auto timeInUtc = ttInSeconds - timeZoneOffsetInSeconds;
    auto ttInMilliseconds = static_cast<int64_t>(timeInUtc) * 1000;
    return ttInMilliseconds;
  }
};

} // namespace winrt::DateTimePicker

void RegisterDateTimePickerComponentView(winrt::Microsoft::ReactNative::IReactPackageBuilder const &packageBuilder) {
  winrt::DateTimePicker::Codegen::RegisterDateTimePickerNativeComponent<
      winrt::DateTimePicker::DateTimePickerComponentView>(
      packageBuilder,
      [](const winrt::Microsoft::ReactNative::Composition::IReactCompositionViewComponentBuilder &builder) {
        builder.SetContentIslandComponentViewInitializer(
            [](const winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView &islandView) noexcept {
              auto userData = winrt::make_self<winrt::DateTimePicker::DateTimePickerComponentView>();
              userData->InitializeContentIsland(islandView);
              islandView.UserData(*userData);
            });
      });
}

#endif // defined(RNW_NEW_ARCH)
