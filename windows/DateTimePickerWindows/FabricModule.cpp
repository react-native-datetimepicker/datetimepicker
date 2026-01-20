// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
//
// FabricModule.cpp - Provides C++/WinRT DLL exports for Fabric mode
// This replaces module.g.cpp which contains XAML ViewManager registrations

#include "pch.h"
#include "ReactPackageProvider.h"

// These are required C++/WinRT DLL exports
// In Fabric mode, we don't have runtimeclass factories to return,
// but we still need these exports for the DLL to load correctly.

extern "C"
{
    int32_t __stdcall WINRT_CanUnloadNow() noexcept
    {
        // Return S_FALSE (1) to indicate the DLL cannot be unloaded
        // This is typical for modules that may have live instances
        if (winrt::get_module_lock())
        {
            return 1; // S_FALSE - cannot unload
        }
        return 0; // S_OK - can unload
    }

    int32_t __stdcall WINRT_GetActivationFactory(void* classId, void** factory) noexcept
    {
        // We don't have any WinRT activation factories in Fabric mode
        // Return CLASS_E_CLASSNOTAVAILABLE (0x80040111)
        *factory = nullptr;
        return static_cast<int32_t>(0x80040111L); // CLASS_E_CLASSNOTAVAILABLE
    }

    // Factory function to create the ReactPackageProvider
    // This is called by applications that link against this DLL
    __declspec(dllexport) winrt::Microsoft::ReactNative::IReactPackageProvider __stdcall CreateDateTimePickerPackageProvider() noexcept
    {
        return winrt::make<DateTimePicker::implementation::ReactPackageProvider>();
    }
}
