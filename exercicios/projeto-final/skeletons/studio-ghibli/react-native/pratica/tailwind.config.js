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

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'media',
  theme: {
    extend: { colors, borderRadius },
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
