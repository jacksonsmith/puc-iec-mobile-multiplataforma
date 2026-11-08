module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Path alias @/ → ./src/
      ['module-resolver', { root: ['./src'], alias: { '@': './src' } }],
      // Reanimated 4: o plugin de worklets PRECISA ser o último
      'react-native-worklets/plugin',
    ],
  };
};
