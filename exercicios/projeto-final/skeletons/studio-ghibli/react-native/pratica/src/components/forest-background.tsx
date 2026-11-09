import { Platform, StyleSheet, useWindowDimensions, View, type ViewStyle } from 'react-native';

import { useColorScheme } from './color-scheme';
import { useBrandTokens } from './use-brand-tokens';

const MIN_DIAMETER = 360;
const MAX_DIAMETER = 720;
const DIAMETER_TO_WIDTH = 1.1;
const TRANSPARENT_ALPHA = '00';

type ForestCircle = {
  token: string;
  getCenter: (width: number, height: number, diameter: number) => { x: number; y: number };
  isHiddenAtNight?: boolean;
};

const CIRCLES: ForestCircle[] = [
  { token: 'forest-sky', getCenter: (_w, _h, d) => ({ x: d * 0.2, y: d * 0.15 }) },
  { token: 'forest-canopy', getCenter: (w, _h, d) => ({ x: w, y: d * 0.42 }) },
  {
    token: 'forest-trunk',
    getCenter: (w, h, d) => ({ x: w + d * 0.1, y: h * 0.6 }),
    isHiddenAtNight: true,
  },
  { token: 'forest-ground', getCenter: (_w, h, d) => ({ x: -d * 0.1, y: h + d * 0.05 }) },
];

function getCircleStyle(color: string): ViewStyle {
  const image = `radial-gradient(circle at center, ${color} 0%, ${color}${TRANSPARENT_ALPHA} 70%)`;

  // O react-native-web não entende experimental_backgroundImage.
  return Platform.OS === 'web'
    ? ({ backgroundImage: image } as ViewStyle)
    : { experimental_backgroundImage: image };
}

export function ForestBackground() {
  const tokens = useBrandTokens();
  const isNight = useColorScheme() === 'dark';
  const { width, height } = useWindowDimensions();
  const diameter = Math.min(MAX_DIAMETER, Math.max(MIN_DIAMETER, width * DIAMETER_TO_WIDTH));

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} className="overflow-hidden">
      {CIRCLES.filter((circle) => !(isNight && circle.isHiddenAtNight)).map((circle) => {
        const { x, y } = circle.getCenter(width, height, diameter);

        return (
          <View
            key={circle.token}
            style={[
              {
                position: 'absolute',
                left: x - diameter / 2,
                top: y - diameter / 2,
                width: diameter,
                height: diameter,
              },
              getCircleStyle(tokens.color(circle.token)),
            ]}
          />
        );
      })}
    </View>
  );
}
