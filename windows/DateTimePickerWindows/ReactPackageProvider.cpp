// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#include "pch.h"
#include "ReactPackageProvider.h"

#if defined(RNW_NEW_ARCH)
#include "DateTimePickerFabric.h"
#include "TimePickerFabric.h"
#else
#include "DateTimePickerViewManager.h"
#include "TimePickerViewManager.h"
#endif

using namespace winrt::Microsoft::ReactNative;

namespace DateTimePicker::implementation {

  void ReactPackageProvider::CreatePackage(IReactPackageBuilder const& packageBuilder) noexcept {
#if defined(RNW_NEW_ARCH)
      // Register Fabric component views for new architecture
      RegisterDateTimePickerComponentView(packageBuilder);
      RegisterTimePickerComponentView(packageBuilder);
#else
      // Register XAML ViewManagers for old architecture
      packageBuilder.AddViewManager(L"DateTimePickerViewManager", []() { return winrt::make<DateTimePickerViewManager>(); });
      packageBuilder.AddViewManager(L"TimePickerViewManager", []() { return winrt::make<TimePickerViewManager>(); });
#endif
  }

}