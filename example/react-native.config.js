'use strict';

const path = require('path');

module.exports = {
  // Dependencies configuration - point to the parent folder (the library)
  dependencies: {
    '@react-native-community/datetimepicker': {
      root: path.resolve(__dirname, '..'),
    },
  },
};
