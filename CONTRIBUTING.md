## Contributing to the component

Development can be done using the example app. Follow readme instructions on running the example app, open it in Xcode or Android Studio and you can start contributing!

### Clone, install

```sh
git clone https://github.com/react-native-community/datetimepicker.git
cd datetimepicker
yarn
```

### Tests

#### Jest

```sh
yarn
yarn test
```

#### Detox

Detox is a gray box end-to-end testing and automation library for mobile apps.

- [Dependencies required](https://wix.github.io/Detox/docs/introduction/getting-started/#detox-prerequisites)

For cleaning all the detox builds just run `npm run detox:clean`.

##### iOS

- debug:

  ```sh
  # Debug requires to run Metro Bundler
  yarn start
  cd "example/ios" && npx pod-install && cd -
  yarn detox:ios:build:debug
  yarn detox:ios:test:debug
  ```

- release:

  ```sh
  yarn bundle:ios # we need to bundle js first
  cd "example/ios" && npx pod-install && cd - # run pod install to include bundle
  yarn detox:ios:build:release
  yarn detox:ios:test:release
  ```

##### Android

An existing Android emulator is required to match the name defined in `detox.configurations.android.emu.debug.name` and `detox.configurations.android.emu.release.name` inside the `package.json`.

- debug:

  ```sh
  # Debug requires to run Metro Bundler
  yarn start
  yarn detox:android:build:debug
  yarn detox:android:test:debug
  ```

- release:

  ```sh
  yarn bundle:android # we need to bundle js first
  yarn detox:android:build:release
  yarn detox:android:test:release
  ```

### Fabric

Fabric is the new React Native rendering system ([read more about it here](https://reactnative.dev/architecture/fabric-renderer)).

#### iOS

```
yarn start
cd "example/ios" && RCT_NEW_ARCH_ENABLED=1 npx pod-install && cd -
yarn start:ios
```

If you want to go back to the old renderer (Paper), 
remove `ios/build`, run `pod-install` without the `RCT_NEW_ARCH_ENABLED=1` and build again

```
rm -r "example/ios/build"
cd "example/ios" && npx pod-install && cd -
yarn start:ios
```


#### Android

The date time picker does not have a native UI component for Android but a native module.
([read more about native modules here](https://reactnative.dev/docs/turbo-native-modules-introduction)).