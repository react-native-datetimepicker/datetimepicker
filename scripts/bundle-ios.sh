#!/bin/bash

mkdir -p example/ios/build/Build/Products/Release-iphonesimulator/example.app
node node_modules/react-native/cli.js bundle --entry-file example/index.js --platform ios --dev false --reset-cache --bundle-output example/ios/build/Build/Products/Release-iphonesimulator/example.app/main.jsbundle --assets-dest example/ios/build/Build/Products/Release-iphonesimulator/example.app
