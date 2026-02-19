const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const fs = require('fs');
const path = require('path');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const monorepoRoot = path.resolve(__dirname, '..');
const librarySrc = path.resolve(monorepoRoot, 'src');
const rnwPath = fs.realpathSync(
  path.resolve(require.resolve('react-native-windows/package.json'), '..'),
);

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

const config = {
  resolver: {
    extraNodeModules: {
      '@react-native-community/datetimepicker': path.resolve(
        __dirname,
        '..',
      ),
      '@babel/runtime': path.resolve(__dirname, '../node_modules/@babel/runtime'),
    },
    blockList: exclusionList([
      // Prevent Metro from watching Windows build artifacts
      new RegExp(`${path.resolve(__dirname, 'windows').replace(/[/\\]/g, '/')}.*`),
      // Prevent Metro from hitting msbuild files
      new RegExp(`${rnwPath.replace(/[/\\]/g, '/')}/build/.*`),
      new RegExp(`${rnwPath.replace(/[/\\]/g, '/')}/target/.*`),
      /.*\.ProjectImports\.zip/,
    ]),
  },
  watchFolders: [
    monorepoRoot,
    librarySrc,
    // This allows us to use the local version of react-native-windows
    rnwPath,
    // This allows us to use the local version of @react-native-community/datetimepicker
    path.resolve(__dirname, '../src'),
  ],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
