module.exports = function(api) {
  api.cache(!!process.env.SHOULD_CACHE);
  return {
    presets: ['babel-preset-expo'],
    plugins: [[
      'module-resolver', {
        'alias': {
          'react-native-datetimepicker': '../src/index',
        },
      },
    ]],
  };
};
