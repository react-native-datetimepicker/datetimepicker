const root = process.cwd();

module.exports = {
  dependencies: {
    datetimepicker: {
      root,
    },
  },
  project: {
    android: {
      sourceDir: './example/android',
    },
  },
};
