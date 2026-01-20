// DateTimePickerDemo.cpp : Defines the entry point for the application.
//

#include "pch.h"
#include "DateTimePickerDemo.h"

#include "AutolinkedNativeModules.g.h"

#include "NativeModules.h"

// Windows App SDK Bootstrap
#include <MddBootstrap.h>
#include <WindowsAppSDK-VersionInfo.h>
#pragma comment(lib, "Microsoft.WindowsAppRuntime.Bootstrap.lib")

// A PackageProvider containing any turbo modules you define within this app project
struct CompReactPackageProvider
    : winrt::implements<CompReactPackageProvider, winrt::Microsoft::ReactNative::IReactPackageProvider> {
  public: // IReactPackageProvider
  void CreatePackage(winrt::Microsoft::ReactNative::IReactPackageBuilder const &packageBuilder) noexcept {
    AddAttributedModules(packageBuilder, true);
  }
};

// The entry point of the Win32 application
_Use_decl_annotations_ int CALLBACK WinMain(HINSTANCE instance, HINSTANCE, PSTR /* commandLine */, int showCmd) {
  // Initialize the Windows App SDK for non-packaged apps
  const UINT32 majorMinorVersion = WINDOWSAPPSDK_RELEASE_MAJORMINOR;
  const PCWSTR versionTag = WINDOWSAPPSDK_RELEASE_VERSION_TAG_W;
  PACKAGE_VERSION minVersion{};
  minVersion.Version = WINDOWSAPPSDK_RUNTIME_VERSION_UINT64;
  
  HRESULT hr = MddBootstrapInitialize(majorMinorVersion, versionTag, minVersion);
  if (FAILED(hr)) {
    WCHAR msg[256];
    swprintf_s(msg, L"MddBootstrapInitialize failed with HRESULT: 0x%08X", hr);
    MessageBoxW(nullptr, msg, L"Bootstrap Error", MB_OK | MB_ICONERROR);
    return 1;
  }

  // Initialize WinRT
  winrt::init_apartment(winrt::apartment_type::single_threaded);

  // Enable per monitor DPI scaling
  SetProcessDpiAwarenessContext(DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2);

  // Find the path hosting the app exe file
  WCHAR appDirectory[MAX_PATH];
  GetModuleFileNameW(NULL, appDirectory, MAX_PATH);
  PathCchRemoveFileSpec(appDirectory, MAX_PATH);

  // DEBUG: Check we got past init
  OutputDebugStringW(L"DEBUG: About to create ReactNativeAppBuilder\n");
  
  try {
    // Create a ReactNativeWin32App with the ReactNativeAppBuilder
    winrt::Microsoft::ReactNative::ReactNativeAppBuilder builder{};
    OutputDebugStringW(L"DEBUG: Builder created, calling Build()\n");
    auto reactNativeWin32App{builder.Build()};

  // Configure the initial InstanceSettings for the app's ReactNativeHost
  auto settings{reactNativeWin32App.ReactNativeHost().InstanceSettings()};

  // Register any autolinked native modules
  RegisterAutolinkedNativeModulePackages(settings.PackageProviders());

  // Register any native modules defined within this app project
  settings.PackageProviders().Append(winrt::make<CompReactPackageProvider>());

#if BUNDLE
  // Load the JS bundle from a file (not Metro):
  // Set the path (on disk) where the .bundle file is located
  settings.BundleRootPath(std::wstring(L"file://").append(appDirectory).append(L"\\Bundle\\").c_str());

  // Set the name of the bundle file (without the .bundle extension)
  settings.JavaScriptBundleFile(L"index.windows");

  // Disable hot reload
  settings.UseFastRefresh(false);
#else
  // Load the JS bundle from Metro
  settings.JavaScriptBundleFile(L"index");

  // Enable hot reload
  settings.UseFastRefresh(true);
#endif

#if _DEBUG
  // For Debug builds
  // Enable Direct Debugging of JS
  settings.UseDirectDebugger(true);

  // Enable the Developer Menu
  settings.UseDeveloperSupport(true);
#else
  // For Release builds:
  // Disable Direct Debugging of JS
  settings.UseDirectDebugger(false);

  // Disable the Developer Menu
  settings.UseDeveloperSupport(false);
#endif

  // Get the AppWindow so we can configure its initial title and size
  auto appWindow{reactNativeWin32App.AppWindow()};
  appWindow.Title(L"DateTimePickerDemo");
  appWindow.Resize({1000, 1000});

  // Get the ReactViewOptions so we can set the initial RN component to load
  auto viewOptions{reactNativeWin32App.ReactViewOptions()};
  viewOptions.ComponentName(L"DateTimePickerDemo");

  // Start the app
  reactNativeWin32App.Start();
  
  } catch (const winrt::hresult_error& e) {
    WCHAR msg[1024];
    swprintf_s(msg, L"WinRT error: 0x%08X\n%s", e.code().value, e.message().c_str());
    MessageBoxW(nullptr, msg, L"Error", MB_OK | MB_ICONERROR);
    return 1;
  } catch (...) {
    MessageBoxW(nullptr, L"Unknown exception occurred", L"Error", MB_OK | MB_ICONERROR);
    return 1;
  }
  
  return 0;
}
