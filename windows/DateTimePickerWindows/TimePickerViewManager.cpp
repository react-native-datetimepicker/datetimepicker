// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#include "pch.h"
#include "TimePickerViewManager.h"
#include "NativeModules.h"
#include "TimePickerView.h"

namespace winrt {
    using namespace Microsoft::ReactNative;
    using namespace Windows::Foundation::Collections;

    namespace xaml = winrt::Windows::UI::Xaml;
}

namespace winrt::DateTimePicker::implementation {

    TimePickerViewManager::TimePickerViewManager() {}

    // IViewManager
    winrt::hstring TimePickerViewManager::Name() noexcept {
        return L"RNTimePickerWindows";
    }

    xaml::FrameworkElement TimePickerViewManager::CreateView() noexcept {
        return winrt::DateTimePicker::TimePickerView(m_reactContext);
    }

    // IViewManagerWithReactContext
    winrt::IReactContext TimePickerViewManager::ReactContext() noexcept {
        return m_reactContext;
    }

    void TimePickerViewManager::ReactContext(IReactContext reactContext) noexcept {
        m_reactContext = reactContext;
    }

    // IViewManagerWithNativeProperties
    IMapView<hstring, ViewManagerPropertyType> TimePickerViewManager::NativeProps() noexcept {
        auto nativeProps = winrt::single_threaded_map<hstring, ViewManagerPropertyType>();
        nativeProps.Insert(L"selectedTime", ViewManagerPropertyType::Number);
        nativeProps.Insert(L"is24Hour", ViewManagerPropertyType::Boolean);
        nativeProps.Insert(L"minuteInterval", ViewManagerPropertyType::Number);

        return nativeProps.GetView();
    }

    void TimePickerViewManager::UpdateProperties(xaml::FrameworkElement const& view,
        IJSValueReader const& propertyMapReader) noexcept {
        if (auto timePickerView = view.try_as<TimePickerView>()) {
            timePickerView->UpdateProperties(propertyMapReader);
        }
        else {
            OutputDebugStringW(L"Type deduction for TimePickerView failed.");
        }
    }

    // IViewManagerWithExportedEventTypeConstants
    ConstantProviderDelegate TimePickerViewManager::ExportedCustomBubblingEventTypeConstants() noexcept {
        return nullptr;
    }

    ConstantProviderDelegate TimePickerViewManager::ExportedCustomDirectEventTypeConstants() noexcept {
        return [](winrt::IJSValueWriter const& constantWriter) {
            WriteCustomDirectEventTypeConstant(constantWriter, "onChange");
        };
    }

}
