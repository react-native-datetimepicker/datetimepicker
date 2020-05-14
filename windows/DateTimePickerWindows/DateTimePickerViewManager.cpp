// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#include "pch.h"
#include "DateTimePickerViewManager.h"
#include "NativeModules.h"
#include "DateTimePickerView.h"

namespace winrt {
    using namespace Microsoft::ReactNative;
    using namespace Windows::Foundation::Collections;

    namespace xaml = winrt::Windows::UI::Xaml;
}

namespace winrt::DateTimePicker::implementation {

    DateTimePickerViewManager::DateTimePickerViewManager() {}

    // IViewManager
    winrt::hstring DateTimePickerViewManager::Name() noexcept {
        return L"RNDateTimePickerWindows";
    }

    xaml::FrameworkElement DateTimePickerViewManager::CreateView() noexcept {
        return winrt::DateTimePicker::DateTimePickerView(m_reactContext);
    }

    // IViewManagerWithReactContext
    winrt::IReactContext DateTimePickerViewManager::ReactContext() noexcept {
        return m_reactContext;
    }

    void DateTimePickerViewManager::ReactContext(IReactContext reactContext) noexcept {
        m_reactContext = reactContext;
    }

    // IViewManagerWithNativeProperties
    IMapView<hstring, ViewManagerPropertyType> DateTimePickerViewManager::NativeProps() noexcept {
        auto nativeProps = winrt::single_threaded_map<hstring, ViewManagerPropertyType>();

        nativeProps.Insert(L"dayOfWeekFormat", ViewManagerPropertyType::String);
        nativeProps.Insert(L"dateFormat", ViewManagerPropertyType::String);
        nativeProps.Insert(L"firstDayOfWeek", ViewManagerPropertyType::Number);
        nativeProps.Insert(L"maxDate", ViewManagerPropertyType::Number);
        nativeProps.Insert(L"minDate", ViewManagerPropertyType::Number);
        nativeProps.Insert(L"placeholderText", ViewManagerPropertyType::String);
        nativeProps.Insert(L"selectedDate", ViewManagerPropertyType::Number);
        nativeProps.Insert(L"timeZoneOffsetInSeconds", ViewManagerPropertyType::Number);

        return nativeProps.GetView();
    }

    void DateTimePickerViewManager::UpdateProperties(xaml::FrameworkElement const& view,
        IJSValueReader const& propertyMapReader) noexcept {
        if (auto dateTimePickerView = view.try_as<DateTimePickerView>()) {
            dateTimePickerView->UpdateProperties(propertyMapReader);
        } else {
            OutputDebugStringW(L"Type deduction for DateTimePickerView failed.");
        }
    }

    // IViewManagerWithExportedEventTypeConstants
    ConstantProviderDelegate DateTimePickerViewManager::ExportedCustomBubblingEventTypeConstants() noexcept {
        return nullptr;
    }

    ConstantProviderDelegate DateTimePickerViewManager::ExportedCustomDirectEventTypeConstants() noexcept {
        return [](winrt::IJSValueWriter const& constantWriter) {
            WriteCustomDirectEventTypeConstant(constantWriter, "onChange");
        };
    }

}
