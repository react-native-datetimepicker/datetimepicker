// WinRTStubs.cpp
// This file provides WinRT activation factory overrides for non-packaged Win32 apps.
// For non-packaged apps, RoGetActivationFactory fails, so we need to load factories
// directly from the DLLs.
//
// This file is needed because the Microsoft.ReactNative.Cxx shared items (vcxitems)
// include code that uses WinRT static methods which need these implementations.

#include "pch.h"

#include <winrt/Microsoft.ReactNative.h>
#include <activation.h>
#include <roapi.h>
#include <winstring.h>

#pragma comment(lib, "runtimeobject.lib")

// Function pointer type for DllGetActivationFactory
typedef HRESULT(__stdcall* PFN_DllGetActivationFactory)(HSTRING classId, ::IActivationFactory** factory);

static HMODULE g_hReactNative = nullptr;
static PFN_DllGetActivationFactory g_pfnReactNativeFactory = nullptr;

// Try to get factory from Microsoft.ReactNative.dll
static HRESULT TryGetReactNativeFactory(HSTRING classId, ::IActivationFactory** factory)
{
    if (!g_hReactNative)
    {
        g_hReactNative = GetModuleHandleW(L"Microsoft.ReactNative.dll");
        if (!g_hReactNative)
        {
            g_hReactNative = LoadLibraryW(L"Microsoft.ReactNative.dll");
        }
        if (g_hReactNative)
        {
            g_pfnReactNativeFactory = reinterpret_cast<PFN_DllGetActivationFactory>(
                GetProcAddress(g_hReactNative, "DllGetActivationFactory"));
        }
    }

    if (g_pfnReactNativeFactory)
    {
        return g_pfnReactNativeFactory(classId, factory);
    }
    return REGDB_E_CLASSNOTREG;
}

// ReactPropertyBagHelper static methods - provides implementations for WinRT statics
namespace winrt::Microsoft::ReactNative
{
    static IReactPropertyBagHelperStatics GetPropertyBagHelperStatics()
    {
        if (!g_pfnReactNativeFactory)
        {
            // Initialize the factory function pointer
            g_hReactNative = GetModuleHandleW(L"Microsoft.ReactNative.dll");
            if (!g_hReactNative)
            {
                g_hReactNative = LoadLibraryW(L"Microsoft.ReactNative.dll");
            }
            if (g_hReactNative)
            {
                g_pfnReactNativeFactory = reinterpret_cast<PFN_DllGetActivationFactory>(
                    GetProcAddress(g_hReactNative, "DllGetActivationFactory"));
            }
        }

        if (!g_pfnReactNativeFactory)
        {
            winrt::throw_hresult(E_FAIL);
        }

        winrt::hstring classNameStr(L"Microsoft.ReactNative.ReactPropertyBagHelper");
        ::IActivationFactory* factory = nullptr;
        HRESULT hr = g_pfnReactNativeFactory(static_cast<HSTRING>(winrt::get_abi(classNameStr)), &factory);
        winrt::check_hresult(hr);

        IReactPropertyBagHelperStatics statics{ nullptr };
        hr = factory->QueryInterface(winrt::guid_of<IReactPropertyBagHelperStatics>(), winrt::put_abi(statics));
        factory->Release();
        winrt::check_hresult(hr);
        return statics;
    }

    IReactPropertyNamespace ReactPropertyBagHelper::GlobalNamespace()
    {
        return GetPropertyBagHelperStatics().GlobalNamespace();
    }

    IReactPropertyNamespace ReactPropertyBagHelper::GetNamespace(param::hstring const& namespaceName)
    {
        return GetPropertyBagHelperStatics().GetNamespace(namespaceName);
    }

    IReactPropertyName ReactPropertyBagHelper::GetName(IReactPropertyNamespace const& ns, param::hstring const& localName)
    {
        return GetPropertyBagHelperStatics().GetName(ns, localName);
    }

    IReactPropertyBag ReactPropertyBagHelper::CreatePropertyBag()
    {
        return GetPropertyBagHelperStatics().CreatePropertyBag();
    }
}
