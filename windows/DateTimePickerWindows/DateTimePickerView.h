// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#pragma once

#include "DateTimePickerView.g.h"
#include "winrt/Microsoft.ReactNative.h"
#include "NativeModules.h"

namespace winrt::DateTimePicker::implementation {
    
    namespace xaml = winrt::Windows::UI::Xaml;
    
    class DateTimePickerView : public DateTimePickerViewT<DateTimePickerView> {
    public:
        DateTimePickerView(Microsoft::ReactNative::IReactContext const& reactContext);
        void UpdateProperties(Microsoft::ReactNative::IJSValueReader const& reader);

    private:
        Microsoft::ReactNative::IReactContext m_reactContext{ nullptr };
        bool m_updating{ false };
        xaml::Controls::CalendarDatePicker::DateChanged_revoker m_dataPickerDateChangedRevoker{};

        void RegisterEvents();
        void OnDateChanged(winrt::Windows::Foundation::IInspectable const& sender, xaml::Controls::CalendarDatePickerDateChangedEventArgs const& args);
        winrt::Windows::Foundation::DateTime DateTimeFrom(int64_t timeInMilliSeconds, int64_t timeZoneOffsetInSeconds);
        int64_t DateTimeToMiliseconds(winrt::Windows::Foundation::DateTime dateTime, int64_t timeZoneOffsetInSeconds);

        int64_t m_selectedTime, m_maxTime, m_minTime; // These values are expected to be in milliseconds.
        int64_t m_timeZoneOffsetInSeconds = 0;        // Timezone offset is expected to be in seconds.
    };
}

namespace winrt::DateTimePicker::factory_implementation {
    struct DateTimePickerView : DateTimePickerViewT<DateTimePickerView, implementation::DateTimePickerView> {};
}