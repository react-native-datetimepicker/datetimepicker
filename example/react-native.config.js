'use strict';

const path = require('path');

module.exports = {
  // Disable autolinking for datetimepicker - the autolink files are already pre-configured
  dependencies: {
    '@react-native-community/datetimepicker': {
      root: path.resolve(__dirname, '..'),
      platforms: {
        windows: null, // Disable autolink for this dependency on Windows
      },
    },
  },
  // Project configuration for this example app
  project: {
    windows: {
      sourceDir: 'windows',
      solutionFile: 'DateTimePickerDemo.sln',
      project: {
        projectFile: 'DateTimePickerDemo\\DateTimePickerDemo.vcxproj',
        projectName: 'DateTimePickerDemo',
        projectLang: 'cpp',
        projectGuid: '{120733fe-7210-414d-9b08-a117cb99ad15}',
      },
    },
  },
};
