module.exports = function (api) {
  api.cache(true);
  return {
    // babel-preset-expo (SDK 54) já adiciona 'react-native-worklets/plugin'
    // automaticamente quando react-native-worklets está instalado (Reanimated 4).
    // Não declarar de novo aqui — plugin duplicado quebra os worklets.
    presets: ['babel-preset-expo'],
    plugins: [
      // Path alias @/ → ./src/
      ['module-resolver', { root: ['./src'], alias: { '@': './src' } }],
    ],
  };
};
