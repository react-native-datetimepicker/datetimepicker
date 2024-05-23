## Manual installation

#### iOS

1. Install CocoaPods, here the [installation guide](https://guides.cocoapods.org/using/getting-started.html).
2. Inside the iOS folder run `pod init`, this will create the initial `pod` file.
3. Update your `pod` file to look like the following ( Remember to replace `MyApp` with your target name ):

   ```ruby
   # Allowed sources
   source 'https://github.com/CocoaPods/Specs.git'

   target 'MyApp' do
     # As we use Swift, ensure that `use_frameworks` is enabled.
     use_frameworks!

     # Specific iOS platform we are targetting
     platform :ios, '8.0'

     # Point to the installed version
     pod 'RNDateTimePicker', :path => '../node_modules/@react-native-community/datetimepicker/RNDateTimePicker.podspec'

     # React/React-Native specific pods
     pod 'React', :path => '../node_modules/react-native', :subspecs => [
       'Core',
       'CxxBridge',      # Include this for RN >= 0.47
       'DevSupport',     # Include this to enable In-App Devmenu if RN >= 0.43
       'RCTText',
       'RCTNetwork',
       'RCTWebSocket',   # Needed for debugging
     ]

     # Explicitly include Yoga if you are using RN >= 0.42.0
     pod 'yoga', :path => '../node_modules/react-native/ReactCommon/yoga'

     # Third party deps podspec link
     pod 'DoubleConversion', :podspec => '../node_modules/react-native/third-party-podspecs/DoubleConversion.podspec'
     pod 'glog', :podspec => '../node_modules/react-native/third-party-podspecs/glog.podspec'
     pod 'Folly', :podspec => '../node_modules/react-native/third-party-podspecs/Folly.podspec'

   end
   ```

4. Run `pod install` inside the same folder where the `pod` file was created
5. `npm run start`
6. `npm run start:ios`

#### Android

Add the import and link the package in `MainApplication.java`:

   ```diff
   + import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;

   public class MainApplication extends Application implements ReactApplication {

     @Override
     protected List<ReactPackage> getPackages() {
       @SuppressWarnings("UnnecessaryLocalVariable")
       List<ReactPackage> packages = new PackageList(this).getPackages();
       // Packages that cannot be autolinked yet can be added manually here, for example:
   +   packages.add(new RNDateTimePickerPackage());
       return packages;
     }
   }
   ```

#### Windows

##### Add the DateTimePickerWindows project to your solution

1. Open the solution in Visual Studio 2019
2. Right-click solution icon in Solution Explorer > Add > Existing Project
   Select 'D:\pathToYourApp\node_modules\@react-native-community\datetimepicker\windows\DateTimePickerWindows\DateTimePickerWindows.vcxproj'

##### **windows/myapp.sln**

Add a reference to `DateTimePickerWindows` to your main application project. From Visual Studio 2019:

Right-click main application project > Add > Reference...
Check 'DateTimePickerWindows' from the 'Project > Solution' tab on the left.

##### **pch.h**

Add `#include "winrt/DateTimePicker.h"`.

##### **app.cpp**

Add `PackageProviders().Append(winrt::DateTimePicker::ReactPackageProvider());` before `InitializeComponent();`.
