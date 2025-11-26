// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

#include "pch.h"

#include "TimePickerFabric.h"

#if defined(RNW_NEW_ARCH)

#include <winrt/Microsoft.UI.Xaml.Controls.h>
#include <winrt/Windows.Globalization.h>
#include <winrt/Microsoft.ReactNative.Xaml.h>
#include <winrt/Microsoft.ReactNative.Composition.h>

namespace winrt::DateTimePicker {

// TimePickerComponentView implements the Fabric architecture for TimePicker
// using XAML TimePicker hosted in a XamlIsland
struct TimePickerComponentView : public winrt::implements<TimePickerComponentView, winrt::IInspectable> {
  void InitializeContentIsland(
      const winrt::Microsoft::ReactNative::Composition::ContentIslandComponentView &islandView) noexcept {
    m_xamlIsland = winrt::Microsoft::UI::Xaml::XamlIsland{};
    m_timePicker = winrt::Microsoft::UI::Xaml::Controls::TimePicker{};
    islandView.Connect(m_xamlIsland.ContentIsland());

    RegisterEvents();
    
    // Mount the TimePicker immediately so it's visible
    m_xamlIsland.Content(m_timePicker);
  }

  void MountChildComponentView(
      const winrt::Microsoft::ReactNative::ComponentView &childView,
      uint32_t index) noexcept {
    // Mount the TimePicker into the XamlIsland
    m_xamlIsland.Content(m_timePicker);
  }

  void UnmountChildComponentView(
      const winrt::Microsoft::ReactNative::ComponentView &childView,
      uint32_t index) noexcept {
    // Unmount the TimePicker from the XamlIsland
    m_xamlIsland.Content(nullptr);
  }

  void RegisterEvents() {
    // Register the TimeChanged event handler
    m_timePicker.TimeChanged([this](auto &&sender, auto &&args) {
      if (m_updating) {
        return;
      }

      if (m_eventEmitter) {
        auto newTime = args.NewTime();
        
        // Convert TimeSpan to hour and minute
        auto totalMinutes = newTime.count() / 10000000 / 60; // 100-nanosecond intervals to minutes
        auto hour = static_cast<int32_t>(totalMinutes / 60);
        auto minute = static_cast<int32_t>(totalMinutes % 60);
        
        winrt::Microsoft::ReactNative::JSValueObject eventData;
        eventData["hour"] = hour;
        eventData["minute"] = minute;
        
        m_eventEmitter(L"topChange", std::move(eventData));
      }
    });
  }

  void UpdateProps(
      const winrt::Microsoft::ReactNative::ComponentView &view,
      const winrt::Microsoft::ReactNative::IJSValueReader &propsReader) noexcept {
    
    m_updating = true;

    const winrt::Microsoft::ReactNative::JSValueObject props =
        winrt::Microsoft::ReactNative::JSValueObject::ReadFrom(propsReader);

    // Update clock format (12-hour vs 24-hour)
    if (props.find("is24Hour") != props.end()) {
      bool is24Hour = props["is24Hour"].AsBoolean();
      m_timePicker.ClockIdentifier(
          is24Hour 
              ? winrt::to_hstring("24HourClock")
              : winrt::to_hstring("12HourClock"));
    }

    // Update minute increment
    if (props.find("minuteInterval") != props.end()) {
      int32_t minuteInterval = static_cast<int32_t>(props["minuteInterval"].AsInt64());
      m_timePicker.MinuteIncrement(minuteInterval);
    }

    // Update selected time
    if (props.find("selectedTime") != props.end()) {
      int64_t timeInMilliseconds = props["selectedTime"].AsInt64();
      auto timeInSeconds = timeInMilliseconds / 1000;
      auto hours = (timeInSeconds / 3600) % 24;
      auto minutes = (timeInSeconds / 60) % 60;
      
      // Create TimeSpan (100-nanosecond intervals)
      winrt::Windows::Foundation::TimeSpan timeSpan{
          static_cast<int64_t>((hours * 3600 + minutes * 60) * 10000000)
      };
      m_timePicker.Time(timeSpan);
    }

    m_updating = false;
  }

  void SetEventEmitter(winrt::Microsoft::ReactNative::Composition::ViewComponentView::EventEmitterDelegate const &eventEmitter) noexcept {
    m_eventEmitter = eventEmitter;
  }

private:
  winrt::Microsoft::UI::Xaml::XamlIsland m_xamlIsland{nullptr};
  winrt::Windows::UI::Xaml::Controls::TimePicker m_timePicker{nullptr};
  bool m_updating = false;
  winrt::Microsoft::ReactNative::Composition::ViewComponentView::EventEmitterDelegate m_eventEmitter;
};

} // namespace winrt::DateTimePicker

void RegisterTimePickerComponentView(winrt::Microsoft::ReactNative::IReactPackageBuilder const &packageBuilder) {
  packageBuilder.as<winrt::Microsoft::ReactNative::IReactPackageBuilderFabric>().AddViewComponent(
      L"RNTimePickerWindows",
      [](winrt::Microsoft::ReactNative::IReactViewComponentBuilder const &builder) noexcept {
        builder.XamlSupport(true);
        auto compBuilder = builder.as<winrt::Microsoft::ReactNative::Composition::IReactCompositionViewComponentBuilder>();

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
          auto reader = newProps.as<winrt::Microsoft::ReactNative::IComponentProps>().try_as<winrt::Microsoft::ReactNative::IJSValueReader>();
          if (reader) {
            userData->UpdateProps(view, reader);
          }
        });

        compBuilder.SetUpdateEventEmitterHandler([](const winrt::Microsoft::ReactNative::ComponentView &view,
                                                    const winrt::Microsoft::ReactNative::Composition::ViewComponentView::EventEmitterDelegate &eventEmitter) noexcept {
          auto userData = view.UserData().as<winrt::DateTimePicker::TimePickerComponentView>();
          userData->SetEventEmitter(eventEmitter);
        });

        compBuilder.SetMountChildComponentViewHandler([](const winrt::Microsoft::ReactNative::ComponentView &view,
                                                         const winrt::Microsoft::ReactNative::ComponentView &childView,
                                                         uint32_t index) noexcept {
          auto userData = view.UserData().as<winrt::DateTimePicker::TimePickerComponentView>();
          userData->MountChildComponentView(childView, index);
        });

        compBuilder.SetUnmountChildComponentViewHandler([](const winrt::Microsoft::ReactNative::ComponentView &view,
                                                           const winrt::Microsoft::ReactNative::ComponentView &childView,
                                                           uint32_t index) noexcept {
          auto userData = view.UserData().as<winrt::DateTimePicker::TimePickerComponentView>();
          userData->UnmountChildComponentView(childView, index);
        });
      });
}

#endif // defined(RNW_NEW_ARCH)
