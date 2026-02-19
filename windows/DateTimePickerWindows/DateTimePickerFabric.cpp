// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// DateTimePickerFabric: Fabric component implementation for declarative <DateTimePicker/> usage
// This is NOT the TurboModule - see DatePickerModuleWindows.cpp for imperative API
// This provides declarative component rendering using XAML Islands

#include "pch.h"

#include "DateTimePickerFabric.h"

#if defined(RNW_NEW_ARCH)

#include "DateTimeHelpers.h"

namespace winrt::DateTimePicker {

// DateTimePickerComponentView method implementations

void DateTimePickerComponentView::InitializeContentIsland(
    const winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView &islandView) noexcept {
  m_xamlIsland = winrt::Microsoft::UI::Xaml::XamlIsland{};
  m_calendarDatePicker = winrt::Microsoft::UI::Xaml::Controls::CalendarDatePicker{};
  islandView.Connect(m_xamlIsland.ContentIsland());

  RegisterEvents();
  
  // Mount the CalendarDatePicker immediately so it's visible
  m_xamlIsland.Content(m_calendarDatePicker);
}

void DateTimePickerComponentView::RegisterEvents() {
  // Register the DateChanged event handler with auto_revoke
  m_dateChangedRevoker = m_calendarDatePicker.DateChanged(winrt::auto_revoke, [this](auto &&sender, auto &&args) {
    if (auto emitter = EventEmitter()) {
      if (args.NewDate() != nullptr) {
        auto newDate = args.NewDate().Value();
        
        // Convert DateTime to milliseconds
        auto timeInMilliseconds = Helpers::DateTimeToMilliseconds(newDate, m_timeZoneOffsetInSeconds);
        
        Codegen::DateTimePicker_OnChange eventArgs;
        eventArgs.newDate = timeInMilliseconds;
        emitter->onChange(eventArgs);
      }
    }
  });
}

namespace {

// RAII helper to temporarily suspend an event handler during property updates.
// This prevents event handlers from firing when properties are changed programmatically.
// The event handler is automatically re-registered when the scope exits.
template<typename TRevoker, typename TSetup, typename TAction>
void WithEventSuspended(TRevoker& revoker, TSetup setup, TAction action) {
  revoker.revoke();
  action();
  revoker = setup();
}

} // anonymous namespace

void DateTimePickerComponentView::UpdateProps(
    const winrt::Microsoft::ReactNative::ComponentView &view,
    const winrt::com_ptr<Codegen::DateTimePickerProps> &newProps,
    const winrt::com_ptr<Codegen::DateTimePickerProps> &oldProps) noexcept {
  Codegen::BaseDateTimePicker<DateTimePickerComponentView>::UpdateProps(view, newProps, oldProps);

  if (!newProps) {
    return;
  }

  // Suspend the DateChanged event while updating properties programmatically
  // to avoid triggering onChange events for prop changes from JavaScript
  WithEventSuspended(
    m_dateChangedRevoker,
    [this]() {
      return m_calendarDatePicker.DateChanged(winrt::auto_revoke, [this](auto &&sender, auto &&args) {
        if (auto emitter = EventEmitter()) {
          if (args.NewDate() != nullptr) {
            auto newDate = args.NewDate().Value();
            auto timeInMilliseconds = Helpers::DateTimeToMilliseconds(newDate, m_timeZoneOffsetInSeconds);
            Codegen::DateTimePicker_OnChange eventArgs;
            eventArgs.newDate = timeInMilliseconds;
            emitter->onChange(eventArgs);
          }
        }
      });
    },
    [this, &newProps]() {
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
        m_calendarDatePicker.MinDate(Helpers::DateTimeFrom(newProps->minimumDate.value(), m_timeZoneOffsetInSeconds));
      }

      if (newProps->maximumDate.has_value()) {
        m_calendarDatePicker.MaxDate(Helpers::DateTimeFrom(newProps->maximumDate.value(), m_timeZoneOffsetInSeconds));
      }

      // Update selected date
      if (newProps->selectedDate.has_value()) {
        m_calendarDatePicker.Date(Helpers::DateTimeFrom(newProps->selectedDate.value(), m_timeZoneOffsetInSeconds));
      }

      // Update accessibilityLabel (using Name property)
      if (newProps->accessibilityLabel.has_value()) {
        m_calendarDatePicker.Name(winrt::to_hstring(newProps->accessibilityLabel.value()));
      }
    }
  );
}

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
