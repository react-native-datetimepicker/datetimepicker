// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#include "pch.h"
#include "ReactPackageProvider.h"
#include "ReactPackageProvider.g.cpp"

#include "DateTimePickerViewManager.h"
#include "TimePickerViewManager.h"

#ifdef RNW_NEW_ARCH
#include "DateTimePickerFabric.h"
#include "TimePickerFabric.h"
#include "DatePickerModuleWindows.h"
#include "TimePickerModuleWindows.h"
#endif

using namespace winrt::Microsoft::ReactNative;

namespace winrt::DateTimePicker::implementation {

  void ReactPackageProvider::CreatePackage(IReactPackageBuilder const& packageBuilder) noexcept {
#ifdef RNW_NEW_ARCH
      // Register Fabric (New Architecture) components
      RegisterDateTimePickerComponentView(packageBuilder);
      RegisterTimePickerComponentView(packageBuilder);
      
      // Register TurboModules
      AddAttributedModules(packageBuilder, true);
#else
      // Register legacy ViewManagers (Old Architecture)
      packageBuilder.AddViewManager(L"DateTimePickerViewManager", []() { return winrt::make<DateTimePickerViewManager>(); });
      packageBuilder.AddViewManager(L"TimePickerViewManager", []() { return winrt::make<TimePickerViewManager>(); });
#endif
  }

}