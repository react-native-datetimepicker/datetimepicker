// swift-tools-version: 6.0
// React Native autolinking resolves these dependencies from its generated
// libs/RNDateTimePicker symlink, relative to the app build directory.

import PackageDescription

let package = Package(
    name: "RNDateTimePicker",
    platforms: [.iOS("15.1")],
    products: [
        .library(name: "RNDateTimePicker", targets: ["RNDateTimePickerTarget"]),
    ],
    dependencies: [
        .package(name: "ReactNative", path: "../../../../xcframeworks"),
        .package(name: "React-GeneratedCode", path: "../../../ios"),
    ],
    targets: [
        .target(
            // A distinct target name avoids treating RNDateTimePicker.h as an
            // umbrella header alongside RNDateTimePicker.xcodeproj.
            name: "RNDateTimePickerTarget",
            dependencies: [.product(name: "ReactHeaders", package: "ReactNative"), .product(name: "ReactNativeHeaders", package: "ReactNative"), .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"), .product(name: "ReactAppHeaders", package: "React-GeneratedCode")],
            path: "ios",
            exclude: ["RNDateTimePicker.xcodeproj"],
            publicHeadersPath: ".",
            cSettings: [
                .define("RCT_NEW_ARCH_ENABLED", to: "1"),
                .headerSearchPath("."),
                .headerSearchPath("fabric"),
                .headerSearchPath("fabric/cpp"),
            ],
            cxxSettings: [
                .define("RCT_NEW_ARCH_ENABLED", to: "1"),
                .headerSearchPath("."),
                .headerSearchPath("fabric"),
                .headerSearchPath("fabric/cpp"),
                .define("DEBUG", .when(configuration: .debug)),
                .define("NDEBUG", .when(configuration: .release)),
            ],
            linkerSettings: [.linkedFramework("UIKit"), .linkedFramework("Foundation"), .linkedFramework("CoreGraphics")]
        ),
    ],
    cxxLanguageStandard: .cxx20
)
