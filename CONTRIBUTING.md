## Contributing to the component

Development can be done using the example app. Follow readme instructions on running the example app, open it in Xcode or Android Studio and you can start contributing!

### Clone, install

```sh
git clone https://github.com/react-native-community/datetimepicker.git
cd datetimepicker
npm install
```

### Tests

#### Jest

```sh
npm install
npm run test
```

#### Detox

Detox is a gray box end-to-end testing and automation library for mobile apps.

- [Dependencies required](https://github.com/wix/Detox/blob/master/docs/Introduction.GettingStarted.md#step-1-install-dependencies)

For cleaning all the detox builds just run `npm run detox:clean`.

##### iOS

- debug:

  ```sh
  # Debug requires to run Metro Bundler
  npm run start
  npm run detox:ios:build:debug
  npm run detox:ios:test:debug
  ```

- release:

  ```sh
  npm run detox:ios:build:release
  npm run detox:ios:test:release
  ```

##### Android

An existing Android emulator is required to match the name defined in `detox.configurations.android.emu.debug.name` and `detox.configurations.android.emu.release.name` inside the `package.json`.

- debug:

  ```sh
  # Debug requires to run Metro Bundler
  npm run start
  npm run detox:android:build:debug
  npm run detox:android:test:debug
  ```

- release:

  ```sh
  npm run detox:android:build:release
  npm run detox:android:test:release
  ```
