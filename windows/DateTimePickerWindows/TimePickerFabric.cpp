// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// TimePickerFabric: Fabric component implementation for declarative <DateTimePicker mode="time"/> usage
// This is NOT the TurboModule - see TimePickerModuleWindows.cpp for imperative API
// This provides declarative component rendering using XAML Islands

#include "pch.h"

#include "TimePickerFabric.h"

#if defined(RNW_NEW_ARCH)

namespace winrt::DateTimePicker {

// TimePickerComponentView method implementations

void TimePickerComponentView::InitializeContentIsland(
    const winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView &islandView) noexcept {
  m_xamlIsland = winrt::Microsoft::UI::Xaml::XamlIsland{};
  m_timePicker = winrt::Microsoft::UI::Xaml::Controls::TimePicker{};
  islandView.Connect(m_xamlIsland.ContentIsland());

  RegisterEvents();
  
  // Mount the TimePicker immediately so it's visible
  m_xamlIsland.Content(m_timePicker);
}

void TimePickerComponentView::RegisterEvents() {
  // Register the TimeChanged event handler with auto_revoke
  m_timeChangedRevoker = m_timePicker.TimeChanged(winrt::auto_revoke, [this](auto &&sender, auto &&args) {
    if (m_eventEmitter) {
      auto newTime = args.NewTime();
      
      // Convert TimeSpan to hour and minute
      auto totalMinutes = newTime.count() / 10000000 / 60; // 100-nanosecond intervals to minutes
      auto hour = static_cast<int32_t>(totalMinutes / 60);
      auto minute = static_cast<int32_t>(totalMinutes % 60);
      
      // Emit the change event
      m_eventEmitter.DispatchEvent(L"change", [hour, minute](const winrt::Microsoft::ReactNative::IJSValueWriter &writer) {
        writer.WriteObjectBegin();
        writer.WritePropertyName(L"hour");
        writer.WriteInt64(hour);
        writer.WritePropertyName(L"minute");
        writer.WriteInt64(minute);
        writer.WriteObjectEnd();
      });
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

void TimePickerComponentView::UpdateProps(
    const winrt::Microsoft::ReactNative::ComponentView &view,
    const winrt::com_ptr<TimePickerProps> &newProps,
    const winrt::com_ptr<TimePickerProps> &oldProps) noexcept {
  
  if (!newProps) {
    return;
  }

  // Suspend the TimeChanged event while updating properties programmatically
  // to avoid triggering onChange events for prop changes from JavaScript
  WithEventSuspended(
    m_timeChangedRevoker,
    [this]() {
      return m_timePicker.TimeChanged(winrt::auto_revoke, [this](auto &&sender, auto &&args) {
        if (m_eventEmitter) {
          auto newTime = args.NewTime();
          auto totalMinutes = newTime.count() / 10000000 / 60;
          auto hour = static_cast<int32_t>(totalMinutes / 60);
          auto minute = static_cast<int32_t>(totalMinutes % 60);
          
          m_eventEmitter.DispatchEvent(L"change", [hour, minute](const winrt::Microsoft::ReactNative::IJSValueWriter &writer) {
            writer.WriteObjectBegin();
            writer.WritePropertyName(L"hour");
            writer.WriteInt64(hour);
            writer.WritePropertyName(L"minute");
            writer.WriteInt64(minute);
            writer.WriteObjectEnd();
          });
        }
      });
    },
    [this, &newProps]() {
      // Update clock format (12-hour vs 24-hour)
      if (newProps->is24Hour.has_value()) {
        m_timePicker.ClockIdentifier(
            newProps->is24Hour.value() 
                ? winrt::to_hstring("24HourClock")
                : winrt::to_hstring("12HourClock"));
      }

      // Update minute increment
      if (newProps->minuteInterval.has_value()) {
        m_timePicker.MinuteIncrement(newProps->minuteInterval.value());
      }

      // Update selected time
      if (newProps->selectedTime.has_value()) {
        const int64_t timeInMilliseconds = newProps->selectedTime.value();
        const auto timeInSeconds = timeInMilliseconds / 1000;
        const auto hours = (timeInSeconds / 3600) % 24;
        const auto minutes = (timeInSeconds / 60) % 60;
        
        // Create TimeSpan (100-nanosecond intervals)
        const winrt::Windows::Foundation::TimeSpan timeSpan{
            static_cast<int64_t>((hours * 3600 + minutes * 60) * 10000000)
        };
        m_timePicker.Time(timeSpan);
      }
    }
  );
}

void TimePickerComponentView::UpdateEventEmitter(
    const winrt::Microsoft::ReactNative::EventEmitter &eventEmitter) noexcept {
  m_eventEmitter = eventEmitter;
}

} // namespace winrt::DateTimePicker

void RegisterTimePickerComponentView(winrt::Microsoft::ReactNative::IReactPackageBuilder const &packageBuilder) {
  packageBuilder.as<winrt::Microsoft::ReactNative::IReactPackageBuilderFabric>().AddViewComponent(
      L"RNTimePickerWindows",
      [](winrt::Microsoft::ReactNative::IReactViewComponentBuilder const &builder) noexcept {
        auto compBuilder = builder.as<winrt::Microsoft::ReactNative::Composition::IReactCompositionViewComponentBuilder>();

        builder.SetCreateProps([](winrt::Microsoft::ReactNative::ViewProps props,
                              const winrt::Microsoft::ReactNative::IComponentProps& cloneFrom) noexcept {
            return winrt::make<winrt::DateTimePicker::TimePickerProps>(props, cloneFrom); 
        });

        compBuilder.SetContentIslandComponentViewInitializer(
            [](const winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView &islandView) noexcept {
              auto userData = winrt::make_self<winrt::DateTimePicker::TimePickerComponentView>();
              userData->InitializeContentIsland(islandView);
              islandView.UserData(*userData);
            });

        builder.SetUpdatePropsHandler([](const winrt::Microsoft::ReactNative::ComponentView &view,
                                         const winrt::Microsoft::ReactNative::IComponentProps &newProps,
                                         const winrt::Microsoft::ReactNative::IComponentProps &oldProps) noexcept {
          auto userData = view.UserData().as<winrt::DateTimePicker::TimePickerComponentView>();
          userData->UpdateProps(view, 
              newProps ? newProps.as<winrt::DateTimePicker::TimePickerProps>() : nullptr, 
              oldProps ? oldProps.as<winrt::DateTimePicker::TimePickerProps>() : nullptr);
        });

        builder.SetUpdateEventEmitterHandler([](const winrt::Microsoft::ReactNative::ComponentView &view,
                                                const winrt::Microsoft::ReactNative::EventEmitter &eventEmitter) noexcept {
          auto userData = view.UserData().as<winrt::DateTimePicker::TimePickerComponentView>();
          userData->UpdateEventEmitter(eventEmitter);
        });
      });
}

#endif // defined(RNW_NEW_ARCH)
