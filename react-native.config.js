const path = require('path');

const project = (() => {
  try {
    const { configureProjects } = require('react-native-test-app');
    return configureProjects({
      android: {
        sourceDir: path.join('example', 'android'),
      },
      ios: {
        sourceDir: path.join('example', 'ios'),
      },
    });
  } catch (_) {
    return undefined;
  }
})();

module.exports = {
  dependencies: {
    // Help rn-cli find and autolink this library
    '@react-native-community/datetimepicker': {
      root: __dirname,
      platforms: {
        android: {
          componentDescriptors: null,
        },
      },
    },
  },
  ...(project ? { project } : undefined),
};
