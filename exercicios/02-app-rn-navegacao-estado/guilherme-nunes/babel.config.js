module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Path alias @/ → ./src/
      ['module-resolver', { root: ['./src'], alias: { '@': './src' } }],
      // Expo SDK 54 configura Worklets/Reanimated via babel-preset-expo.
    ],
  };
};
