module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:jest/recommended'],
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
