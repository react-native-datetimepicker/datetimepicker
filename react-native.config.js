module.exports = {
  dependencies: {
    datetimepicker: {
      root: __dirname,
    },
  },
  project: {
    android: {
      sourceDir: './example/android',
    },
    ios: {
      project: './example/ios/example.xcodeproj',
    },
  },
};

const windowsSwitch = '--use-react-native-windows';

if (process.argv.includes(windowsSwitch)) {
  process.argv = process.argv.filter(arg => arg !== windowsSwitch);
  process.argv.push('--config=metro.config.windows.js');
  module.exports = {
    reactNativePath: 'node_modules/react-native-windows',
  };
}
