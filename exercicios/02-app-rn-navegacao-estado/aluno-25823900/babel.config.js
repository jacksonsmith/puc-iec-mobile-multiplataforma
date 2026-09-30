module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Path alias @/ → ./src/
      ['module-resolver', { root: ['./src'], alias: { '@': './src' } }],
      // Worklets precisa ser o último plugin (Reanimated 4)
      'react-native-worklets/plugin',
    ],
  };
};
