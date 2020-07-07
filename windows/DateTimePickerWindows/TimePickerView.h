// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#pragma once

#include "TimePickerView.g.h"
#include "winrt/Microsoft.ReactNative.h"
#include "NativeModules.h"

namespace winrt::DateTimePicker::implementation {
    
    namespace xaml = winrt::Windows::UI::Xaml;
    
    class TimePickerView : public TimePickerViewT<TimePickerView> {
    public:
        TimePickerView(Microsoft::ReactNative::IReactContext const& reactContext);
        void UpdateProperties(Microsoft::ReactNative::IJSValueReader const& reader);

    private:
        Microsoft::ReactNative::IReactContext m_reactContext{ nullptr };
        bool m_updating{ false };
        xaml::Controls::TimePicker::SelectedTimeChanged_revoker m_timePickerSelectedTimeChangedRevoker{};

        void RegisterEvents();
        void OnTimeChanged(winrt::Windows::Foundation::IInspectable const& sender, xaml::Controls::TimePickerSelectedValueChangedEventArgs  const& args);
        
        int64_t m_selectedTime;
    };
}

namespace winrt::DateTimePicker::factory_implementation {
    struct TimePickerView : TimePickerViewT<TimePickerView, implementation::TimePickerView> {};
}