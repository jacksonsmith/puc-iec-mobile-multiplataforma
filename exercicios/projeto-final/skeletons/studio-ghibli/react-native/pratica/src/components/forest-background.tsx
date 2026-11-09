import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

import { useBrandTokens } from './use-brand-tokens';

const STOPS = [0, 0.35, 0.62, 1] as const;

export function ForestBackground() {
  const tokens = useBrandTokens();

  return (
    <LinearGradient
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      colors={[
        tokens.color('forest-sky'),
        tokens.color('forest-canopy'),
        tokens.color('forest-trunk'),
        tokens.color('forest-ground'),
      ]}
      locations={STOPS}
    />
  );
}
