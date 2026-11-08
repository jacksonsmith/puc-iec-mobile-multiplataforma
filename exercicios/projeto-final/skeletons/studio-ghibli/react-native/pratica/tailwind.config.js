const brandTokens = require('./docs/brand-tokens.json');

const NIGHT_THEME = 'night';
const DAY_THEME = 'day';

const themedColors = brandTokens.color.tokens.filter(({ value }) => typeof value === 'object');
const aliasColors = brandTokens.color.tokens.filter(({ value }) => typeof value === 'string');

const toColorVariable = (name) => `var(--color-${name})`;

function getThemeVariables(theme) {
  return Object.fromEntries(
    themedColors.map(({ name, value }) => [`--color-${name}`, value[theme]]),
  );
}

const colors = Object.fromEntries([
  ...themedColors.map(({ name }) => [name, toColorVariable(name)]),
  ...aliasColors.map(({ name, value }) => [name, toColorVariable(value.replace(/[{}]/g, ''))]),
]);

const borderRadius = Object.fromEntries(
  brandTokens.radius.tokens.map(({ name, value }) => [name.replace('radius-', ''), value]),
);

const typeStyles = brandTokens.type.groups.flatMap(({ styles }) => styles);

// O React Native só aceita letterSpacing em px, e os tokens guardam em em.
function toLetterSpacingPx({ fontSize, letterSpacing }) {
  return `${parseFloat(letterSpacing) * parseFloat(fontSize)}px`;
}

const fontSize = Object.fromEntries(
  typeStyles.map((style) => [
    style.name,
    [
      style.fontSize,
      {
        lineHeight: style.lineHeight,
        ...(style.letterSpacing && { letterSpacing: toLetterSpacingPx(style) }),
      },
    ],
  ]),
);

const fontFamily = {
  'title-600': ['ShipporiMinchoB1_600SemiBold'],
  'title-700': ['ShipporiMinchoB1_700Bold'],
  'title-800': ['ShipporiMinchoB1_800ExtraBold'],
  'text-400': ['ZenKakuGothicNew_400Regular'],
  'text-500': ['ZenKakuGothicNew_500Medium'],
  'text-700': ['ZenKakuGothicNew_700Bold'],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'media',
  theme: {
    extend: { colors, borderRadius, fontSize, fontFamily },
  },
  plugins: [
    ({ addBase }) => {
      addBase({
        ':root': getThemeVariables(DAY_THEME),
        '@media (prefers-color-scheme: dark)': { ':root': getThemeVariables(NIGHT_THEME) },
      });
    },
  ],
};
