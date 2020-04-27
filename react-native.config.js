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
