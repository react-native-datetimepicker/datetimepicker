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
        'example/windows/DateTimePickerDemo.sln',
      ) && {
        sourceDir: path.join('example', 'windows'),
        solutionFile: 'DateTimePickerDemo.sln',
        project: {
          projectFile: 'DateTimePickerDemo\\DateTimePickerDemo.vcxproj',
          projectName: 'DateTimePickerDemo',
          projectLang: 'cpp',
          projectGuid: '{120733fe-7210-414d-9b08-a117cb99ad15}',
        },
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
        projects: [
          {
            projectFile: 'DateTimePickerWindows\\DateTimePickerWindows.vcxproj',
            projectName: 'DateTimePicker',
            projectLang: 'cpp',
            projectGuid: '{0986A4DB-8E72-4BB7-AE32-7D9DF1758A9D}',
            directDependency: true,
            cppHeaders: ['winrt/DateTimePicker.h'],
            cppPackageProviders: ['DateTimePicker::ReactPackageProvider'],
          },
        ],
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
