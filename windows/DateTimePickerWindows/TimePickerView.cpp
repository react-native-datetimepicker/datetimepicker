// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#include "pch.h"
#include "JSValueXaml.h"
#include "TimePickerView.h"
#include "TimePickerView.g.cpp"

#include <winrt/Windows.Globalization.h>


namespace winrt {
    using namespace Microsoft::ReactNative;
    using namespace Windows::Foundation;
}

namespace winrt::DateTimePicker::implementation {

    TimePickerView::TimePickerView(winrt::IReactContext const& reactContext) : m_reactContext(reactContext) {
        RegisterEvents();
    }

    void TimePickerView::RegisterEvents() {
        m_timePickerSelectedTimeChangedRevoker = this->SelectedTimeChanged(winrt::auto_revoke,
            [ref = get_weak()](auto const& sender, auto const& args) {
            if (auto self = ref.get()) {
                self->OnTimeChanged(sender, args);
            }
        });
    }

    void TimePickerView::UpdateProperties(winrt::IJSValueReader const& reader) {
        m_updating = true;

        bool updateSelectedTime = false;
        auto const& propertyMap = JSValueObject::ReadFrom(reader);

        for (auto const& pair : propertyMap) {
            auto const& propertyName = pair.first;
            auto const& propertyValue = pair.second;

            if (propertyName == "selectedTime") {
                if (propertyValue.IsNull()) {
                    this->ClearValue(xaml::Controls::TimePicker::TimeProperty());
                }
                else {
                    // Incoming value will be in milliseconds from Jan 1, 1970.
                    // Need to extract hours and minutes elapsed since midnight today.
                    auto minutesSinceEpoch = propertyValue.AsInt64() / (1000 * 60);
                    auto minutesToday = minutesSinceEpoch % (24 * 60);
                    m_selectedTime = minutesToday;

                    updateSelectedTime = true;
                }
            } else if (propertyName == "is24Hour") {
                if (propertyValue.IsNull()) {
                    this->ClearValue(xaml::Controls::TimePicker::ClockIdentifierProperty());
                } else {
                    auto is24Hours = propertyValue.AsJSBoolean();
                    if (is24Hours) {
                        this->ClockIdentifier(winrt::Windows::Globalization::ClockIdentifiers::TwentyFourHour());
                    } else {
                        this->ClockIdentifier(winrt::Windows::Globalization::ClockIdentifiers::TwelveHour());
                    }
                }
            } else if (propertyName == "minuteInterval") {
                if (propertyValue.IsNull()) {
                    this->ClearValue(xaml::Controls::TimePicker::MinuteIncrementProperty());
                }
                else {
                    auto minuteIncrement = propertyValue.AsInt32();
                    this->MinuteIncrement(minuteIncrement);
                }
            }

        }

        if (updateSelectedTime) {
            this->Time(winrt::TimeSpan{ m_selectedTime * 60 * 1000 * 10000 });
        }

        m_updating = false;
    }

    void TimePickerView::OnTimeChanged(winrt::IInspectable const& /*sender*/, xaml::Controls::TimePickerSelectedValueChangedEventArgs const& args) {
        if (!m_updating) {
            const int secondsPerDay = 24 * 3600;
            const int chronoSliceInMillis = 10000;

            // The React Native component uses the JavaScript Date() class to represent the selected time, which stores milliseconds internally.
            // User-selected time is represented as the number of 100ns slices elapsed from midnight (due to std::chrono). Conversion is required.
            // As in iOS, the no. of miliseconds returned in the event will correspond to today's date, with the time value selected by the user.
            // Additionally, JavaScript uses Jan 1, 1970 as its starting point for date calculations. std::chrono uses Jan 1, 1601. 

            auto selectedTime = args.NewTime().GetTimeSpan().count();
            selectedTime = selectedTime / chronoSliceInMillis;

            auto nowInSeconds = winrt::clock::to_time_t(winrt::DateTime::clock::now());
            auto daysSinceDawnOfTime = nowInSeconds / secondsPerDay;
            auto tickCount = (daysSinceDawnOfTime * secondsPerDay) * 1000 + selectedTime;

            m_reactContext.DispatchEvent(
                *this,
                L"topChange",
                [&](winrt::Microsoft::ReactNative::IJSValueWriter const& eventDataWriter) noexcept {
                    eventDataWriter.WriteObjectBegin();
                    {
                        WriteProperty(eventDataWriter, L"newDate", tickCount);
                    }
                    eventDataWriter.WriteObjectEnd();
                });
        }
    }
}