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

- [Dependencies required](https://github.com/wix/Detox/blob/master/docs/Introduction.GettingStarted.md#step-1-install-dependencies)

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
  yarn detox:android:build:release
  yarn detox:android:test:release
  ```
