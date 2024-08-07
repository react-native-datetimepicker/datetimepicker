const project = (() => {
  const fs = require('fs');
  const path = require('path');
  try {
    const {configureProjects} = require('react-native-test-app');

    return configureProjects({
      android: {
        sourceDir: path.join('example', 'android'),
        manifestPath: path.join(__dirname, 'example', 'android'),
      },
      ios: {
        sourceDir: 'example/ios',
      },
      windows: fs.existsSync(
        'example/windows/date-time-picker-example.sln',
      ) && {
        sourceDir: path.join('example', 'windows'),
        solutionFile: path.join(
          'example',
          'windows',
          'date-time-picker-example.sln',
        ),
        project: path.join(__dirname, 'example', 'windows'),
      },
    });
  } catch (e) {
    return undefined;
  }
})();

module.exports = {
  dependency: {
    platforms: {
      windows: {
        sourceDir: 'windows',
        solutionFile: 'DateTimePickerWindows.sln',
      },
    },
  },
  dependencies: {
    ...(project
      ? {
        // Help rn-cli find and autolink this library
        '@react-native-community/datetimepicker': {
          root: __dirname,
        },
        'expo': {
          // otherwise RN cli will try to autolink expo
          platforms: {
            ios: null,
            android: null,
          },
        },
      }
      : undefined),
  },
  ...(project ? {project} : undefined),
};
