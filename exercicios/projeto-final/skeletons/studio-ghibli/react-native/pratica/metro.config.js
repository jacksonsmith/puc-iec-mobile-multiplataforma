const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// inlineRem: a escala de 4px dos tokens exige 1rem = 16px; o padrão no celular é 14.
module.exports = withNativeWind(config, { input: './src/global.css', inlineRem: 16 });
