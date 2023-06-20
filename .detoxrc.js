module.exports = {
  testRunner: {
    $0: 'jest',
    args: {
      config: 'example/e2e/jest.config.js',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 14',
      },
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'TestingAVD',
      },
    },
    'android.attached': {
      type: 'android.attached',
      device: {
        adbName: '34HDU19716000753',
      },
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath:
        'example/ios/build/Build/Products/Debug-iphonesimulator/ReactTestApp.app',
      build:
        "export RCT_NO_LAUNCH_PACKAGER=true && xcodebuild -workspace example/ios/date-time-picker-example.xcworkspace -destination 'platform=iOS Simulator,name=iPhone 14' -scheme date-time-picker-example -configuration Debug -derivedDataPath example/ios/build -UseModernBuildSystem=YES CODE_SIGNING_ALLOWED=NO",
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath:
        'example/ios/build/Build/Products/Release-iphonesimulator/ReactTestApp.app',
      build:
        'export RCT_NO_LAUNCH_PACKAGER=true && xcodebuild -workspace example/ios/date-time-picker-example.xcworkspace -sdk iphonesimulator -scheme date-time-picker-example -configuration Release -derivedDataPath example/ios/build -UseModernBuildSystem=YES CODE_SIGNING_ALLOWED=NO',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'example/android/app/build/outputs/apk/debug/app-debug.apk',
      build:
        'export RCT_NO_LAUNCH_PACKAGER=true && (cd example/android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug)',
    },
    'android.release': {
      type: 'android.apk',
      binaryPath:
        'example/android/app/build/outputs/apk/release/app-release.apk',
      build:
        'export RCT_NO_LAUNCH_PACKAGER=true && (cd example/android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release)',
    },
  },
  configurations: {
    'ios.sim.debug': {
      app: 'ios.debug',
      device: 'simulator',
    },
    'ios.sim.release': {
      app: 'ios.release',
      device: 'simulator',
    },
    'android.emu.debug': {
      app: 'android.debug',
      device: 'emulator',
    },
    'android.device.debug': {
      app: 'android.debug',
      device: 'android.attached',
    },
    'android.emu.release': {
      app: 'android.release',
      device: 'emulator',
    },
  },
  artifacts: {
    plugins: {
      video: {
        android: {
          size: [1280, 720],
        },
      },
    },
  },
};
