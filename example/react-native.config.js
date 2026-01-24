'use strict';

const path = require('path');

module.exports = {
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
  // Dependencies configuration - point to the parent folder (the library)
  dependencies: {
    '@react-native-community/datetimepicker': {
      root: path.resolve(__dirname, '..'),
    },
  },
};
