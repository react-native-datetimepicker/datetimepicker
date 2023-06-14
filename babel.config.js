module.exports = {
  presets: [
    [
      'module:metro-react-native-babel-preset',
      // this is a workaround for some deeper issue
      {useTransformReactJSXExperimental: process.env.NODE_ENV !== 'test'},
    ],
  ],
};
