module.exports = {
  preset: 'react-native',
  modulePathIgnorePatterns: ['<rootDir>/example/node_modules'],
  transform: {
    '^.+\\.js$': require.resolve('react-native/jest/preprocessor.js'),
  },
  setupFiles: ['./jest/setup.js'],
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.[jt]sx?$',
};
