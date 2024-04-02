const isLintingOrTesting =
  process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'lint';

module.exports = {
  presets: ['module:@react-native/babel-preset'],
};
