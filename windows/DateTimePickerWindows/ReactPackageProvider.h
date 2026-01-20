// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#pragma once

#include "winrt/Microsoft.ReactNative.h"

using namespace winrt::Microsoft::ReactNative;

namespace DateTimePicker::implementation
{
    struct ReactPackageProvider : winrt::implements<ReactPackageProvider, winrt::Microsoft::ReactNative::IReactPackageProvider>
    {
    public:
        void CreatePackage(IReactPackageBuilder const& packageBuilder) noexcept;
    };
}