module.exports = {
  root: true,
  parser: 'hermes-eslint',
  extends: ['@react-native', 'plugin:jest/recommended'],
  ignorePatterns: ['**/*.d.ts'],
  globals: {
    expect: true,
    element: true,
    by: true,
    device: true,
    beforeAll: true,
    beforeEach: true,
    afterAll: true,
    jest: true,
    jasmine: true,
    waitFor: true,
    detoxCircus: true,
  },
  rules: {
    'no-var': 2,
    'jest/no-conditional-expect': 0,
  },
};
