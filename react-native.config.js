// react-native.config.js
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
};
