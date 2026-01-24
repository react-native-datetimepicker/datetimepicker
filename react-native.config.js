// react-native.config.js
module.exports = {
  // Project configuration for the example app
  project: {
    windows: {
      sourceDir: 'example/windows',
      solutionFile: 'DateTimePickerDemo.sln',
      project: {
        projectFile: 'DateTimePickerDemo\\DateTimePickerDemo.vcxproj',
        projectName: 'DateTimePickerDemo',
        projectLang: 'cpp',
        projectGuid: '{120733fe-7210-414d-9b08-a117cb99ad15}',
      },
    },
  },
  // Dependency configuration (for when other apps use this library)
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
