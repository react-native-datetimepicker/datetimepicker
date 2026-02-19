// WinRTStubs.cpp
// This file provides WinRT activation factory overrides for non-packaged Win32 apps.
// For non-packaged apps, RoGetActivationFactory fails, so we need to load factories
// directly from the DLLs.

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

// Override for RoGetActivationFactory - this intercepts WinRT activation requests
// and routes them to the appropriate DLL for non-packaged apps
extern "C" HRESULT __stdcall WINRT_RoGetActivationFactory(
    HSTRING classId,
    REFIID iid,
    void** factory) noexcept
{
    // First, try the standard Windows runtime
    HRESULT hr = RoGetActivationFactory(classId, iid, factory);
    if (SUCCEEDED(hr))
    {
        return hr;
    }
    
    // If that failed, check if it's a Microsoft.ReactNative class
    UINT32 length = 0;
    const wchar_t* className = WindowsGetStringRawBuffer(classId, &length);
    if (className && wcsncmp(className, L"Microsoft.ReactNative", 21) == 0)
    {
        ::IActivationFactory* activationFactory = nullptr;
        hr = TryGetReactNativeFactory(classId, &activationFactory);
        if (SUCCEEDED(hr) && activationFactory)
        {
            hr = activationFactory->QueryInterface(iid, factory);
            activationFactory->Release();
            return hr;
        }
    }
    
    return REGDB_E_CLASSNOTREG;
}

// ReactNativeAppBuilder - manual implementation that loads from DLL
namespace winrt::Microsoft::ReactNative
{
    ReactNativeAppBuilder::ReactNativeAppBuilder()
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
        
        if (!g_pfnReactNativeFactory)
        {
            winrt::throw_hresult(E_FAIL);
        }
        
        winrt::hstring classNameStr(L"Microsoft.ReactNative.ReactNativeAppBuilder");
        ::IActivationFactory* factory = nullptr;
        HRESULT hr = g_pfnReactNativeFactory(static_cast<HSTRING>(winrt::get_abi(classNameStr)), &factory);
        winrt::check_hresult(hr);
        
        ::IInspectable* instance = nullptr;
        hr = factory->ActivateInstance(&instance);
        factory->Release();
        winrt::check_hresult(hr);
        
        winrt::attach_abi(*this, instance);
    }

    // ReactPropertyBagHelper static methods
    static IReactPropertyBagHelperStatics GetPropertyBagHelperStatics()
    {
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
