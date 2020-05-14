// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#include "pch.h"
#include "JSValueXaml.h"
#include "DateTimePickerView.h"
#include "DateTimePickerView.g.cpp"

#include <limits>
#include <stdexcept>

namespace winrt {
    using namespace Microsoft::ReactNative;
    using namespace Windows::Foundation;
}

namespace winrt::DateTimePicker::implementation {

    DateTimePickerView::DateTimePickerView(winrt::IReactContext const& reactContext) : m_reactContext(reactContext) {
        RegisterEvents();
    }

    void DateTimePickerView::RegisterEvents() {
        m_dataPickerDateChangedRevoker = this->DateChanged(winrt::auto_revoke,
            [ref = get_weak()](auto const& sender, auto const& args) {
            if (auto self = ref.get()) {
                self->OnDateChanged(sender, args);
            }
        });
    }

    void DateTimePickerView::UpdateProperties(winrt::IJSValueReader const& reader) {
        m_updating = true;

        bool updateSelectedDate = false;
        bool updateMaxDate = false;
        bool updateMinDate = false;

        auto const& propertyMap = JSValueObject::ReadFrom(reader);

        for (auto const& pair : propertyMap) {
            auto const& propertyName = pair.first;
            auto const& propertyValue = pair.second;

            if (propertyName == "dayOfWeekFormat") {
                if (propertyValue.IsNull()) {
                    this->ClearValue(xaml::Controls::CalendarDatePicker::DayOfWeekFormatProperty());
                }
                else {
                    this->DayOfWeekFormat(to_hstring(propertyValue.AsString()));
                }
            }
            else if (propertyName == "dateFormat") {
                if (propertyValue.IsNull()) {
                    this->ClearValue(xaml::Controls::CalendarDatePicker::DateFormatProperty());
                }
                else {
                    this->DateFormat(to_hstring(propertyValue.AsString()));
                }
            }
            else if (propertyName == "firstDayOfWeek") {
                if (propertyValue.IsNull()) {
                    this->ClearValue(xaml::Controls::CalendarDatePicker::FirstDayOfWeekProperty());
                }
                else {
                    auto firstDayOfWeek = propertyValue.AsInt32();
                    this->FirstDayOfWeek(static_cast<Windows::Globalization::DayOfWeek>(firstDayOfWeek));
                }
            }
            else if (propertyName == "maxDate") {
                if (propertyValue.IsNull()) {
                    this->ClearValue(xaml::Controls::CalendarDatePicker::MaxDateProperty());
                }
                else {
                    m_maxTime = propertyValue.AsInt64();
                    updateMaxDate = true;
                }
            }
            else if (propertyName == "minDate") {
                if (propertyValue.IsNull()) {
                    this->ClearValue(xaml::Controls::CalendarDatePicker::MinDateProperty());
                }
                else {
                    m_minTime = propertyValue.AsInt64();
                    updateMinDate = true;
                }
            }
            else if (propertyName == "placeholderText") {
                if (propertyValue.IsNull()) {
                    this->ClearValue(xaml::Controls::CalendarDatePicker::PlaceholderTextProperty());
                }
                else {
                    this->PlaceholderText(to_hstring(propertyValue.AsString()));
                }
            }
            else if (propertyName == "selectedDate") {
                if (propertyValue.IsNull()) {
                    this->ClearValue(xaml::Controls::CalendarDatePicker::DateProperty());
                }
                else {
                    m_selectedTime = propertyValue.AsInt64();
                    updateSelectedDate = true;
                }
            }
            else if (propertyName == "timeZoneOffsetInSeconds") {
                if (propertyValue.IsNull()) {
                    m_timeZoneOffsetInSeconds = 0;
                }
                else {
                    m_timeZoneOffsetInSeconds = propertyValue.AsInt64();
                }
            }
        }

        if (updateMaxDate) {
            this->MaxDate(DateTimeFrom(m_maxTime, m_timeZoneOffsetInSeconds));
        }
        if (updateMinDate) {
            this->MinDate(DateTimeFrom(m_minTime, m_timeZoneOffsetInSeconds));
        }
        if (updateSelectedDate) {
            this->Date(DateTimeFrom(m_selectedTime, m_timeZoneOffsetInSeconds));
        }

        m_updating = false;
    }

    void DateTimePickerView::OnDateChanged(winrt::IInspectable const& /*sender*/, xaml::Controls::CalendarDatePickerDateChangedEventArgs const& args){
        if (!m_updating && args.NewDate() != nullptr) {
            auto timeInMilliseconds = DateTimeToMiliseconds(args.NewDate().Value(), m_timeZoneOffsetInSeconds);

            m_reactContext.DispatchEvent(
                *this,
                L"topChange",
                [&](winrt::Microsoft::ReactNative::IJSValueWriter const& eventDataWriter) noexcept {
                eventDataWriter.WriteObjectBegin();
                {
                    WriteProperty(eventDataWriter, L"newDate", timeInMilliseconds);
                }
                eventDataWriter.WriteObjectEnd();
            });
        }
    }

    winrt::DateTime DateTimePickerView::DateTimeFrom(int64_t timeInMilliSeconds, int64_t timeZoneOffsetInSeconds) {
        const auto timeInSeconds = timeInMilliSeconds / 1000;
        time_t ttWithTimeZoneOffset = static_cast<time_t>(timeInSeconds) + timeZoneOffsetInSeconds;
        winrt::DateTime dateTime = winrt::clock::from_time_t(ttWithTimeZoneOffset);

        return dateTime;
    }

    int64_t DateTimePickerView::DateTimeToMiliseconds(winrt::DateTime dateTime, int64_t timeZoneOffsetInSeconds) {
        const time_t ttInSeconds = winrt::clock::to_time_t(dateTime);
        auto timeInUtc = ttInSeconds - timeZoneOffsetInSeconds;
        if (std::numeric_limits<int64_t>::max() / 1000 < timeInUtc) {
            throw new std::overflow_error("Provided date value is too large.");
        }
        auto ttInMilliseconds = static_cast<int64_t>(timeInUtc) * 1000;

        return ttInMilliseconds;
    }

}
