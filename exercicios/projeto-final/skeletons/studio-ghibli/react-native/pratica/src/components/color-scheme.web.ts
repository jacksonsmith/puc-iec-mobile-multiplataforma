import { useSyncExternalStore } from 'react';
import { Appearance } from 'react-native';

type ColorScheme = 'light' | 'dark';

const DARK_CLASS = 'dark';

let currentScheme: ColorScheme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
const listeners = new Set<() => void>();

function applyScheme() {
  document.documentElement.classList.toggle(DARK_CLASS, currentScheme === 'dark');
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

export function setColorScheme(scheme: ColorScheme) {
  currentScheme = scheme;
  applyScheme();
  listeners.forEach((listener) => listener());
}

export function useColorScheme(): ColorScheme {
  return useSyncExternalStore(subscribe, () => currentScheme);
}

applyScheme();
