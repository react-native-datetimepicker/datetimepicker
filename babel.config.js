const isLintingOrTesting =
  process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'lint';

module.exports = {
  presets: [
    [
      'module:@react-native/babel-preset',
      // this is a workaround for some deeper issue
      {useTransformReactJSXExperimental: !isLintingOrTesting},
    ],
  ],
};
