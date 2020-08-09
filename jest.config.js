module.exports = {
  preset: 'react-native',
  modulePathIgnorePatterns: ['<rootDir>/example/node_modules'],
  transform: {
    '^.+\\.js$': require.resolve('react-native/jest/preprocessor.js'),
  },
  setupFiles: ['./test/setup.js'],
};
