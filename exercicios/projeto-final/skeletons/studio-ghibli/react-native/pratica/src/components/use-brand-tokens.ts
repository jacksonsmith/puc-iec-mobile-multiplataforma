import { useColorScheme } from 'react-native';

import brandTokens from '../../docs/brand-tokens.json';

type ThemeId = 'night' | 'day';
type ThemedValue = string | Record<ThemeId, string>;

function resolveValue(
  value: ThemedValue,
  theme: ThemeId,
  allColors: Map<string, ThemedValue>,
): string {
  if (typeof value !== 'string') return value[theme];

  const alias = value.match(/^\{(.+)\}$/)?.[1];
  const aliasedValue = alias ? allColors.get(alias) : undefined;

  return aliasedValue ? resolveValue(aliasedValue, theme, allColors) : value;
}

const colorValues = new Map<string, ThemedValue>(
  brandTokens.color.tokens.map(({ name, value }) => [name, value]),
);
const shadowValues = new Map<string, ThemedValue>(
  brandTokens.shadow.tokens.map(({ name, value }) => [name, value]),
);

function buildTheme(theme: ThemeId) {
  return {
    color: (name: string) => resolveValue(colorValues.get(name) ?? '', theme, colorValues),
    shadow: (name: string) => resolveValue(shadowValues.get(name) ?? '', theme, shadowValues),
  };
}

const THEMES = { night: buildTheme('night'), day: buildTheme('day') };

/** Para APIs que não aceitam `className`, como `tintColor` e `boxShadow`. */
export function useBrandTokens() {
  return useColorScheme() === 'dark' ? THEMES.night : THEMES.day;
}
