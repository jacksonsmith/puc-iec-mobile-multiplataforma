import { Image } from 'expo-image';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const START_DELAY_MS = 150;
const LOOK_TILT_DEG = 18;
const RATTLE_DEG = 6;
const RATTLE_STEP_MS = 70;

type KodamaMarkProps = {
  size?: number;
};

// A inclinação de 9° faz parte do desenho do símbolo, então a rotação aqui é só o desvio dela.
function entranceSequence() {
  const rattle = (angle: number) =>
    withTiming(angle, { duration: RATTLE_STEP_MS, easing: Easing.linear });

  return withSequence(
    withTiming(LOOK_TILT_DEG, { duration: 160, easing: Easing.out(Easing.quad) }),
    withDelay(180, withTiming(LOOK_TILT_DEG, { duration: 0 })),
    rattle(LOOK_TILT_DEG + RATTLE_DEG),
    rattle(LOOK_TILT_DEG - RATTLE_DEG),
    rattle(LOOK_TILT_DEG + RATTLE_DEG),
    rattle(LOOK_TILT_DEG - RATTLE_DEG),
    rattle(LOOK_TILT_DEG),
    withTiming(0, { duration: 240, easing: Easing.inOut(Easing.quad) }),
  );
}

export function KodamaMark({ size = 32 }: KodamaMarkProps) {
  const isDay = useColorScheme() === 'light';
  const reduceMotion = useReducedMotion();
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    rotation.set(withDelay(START_DELAY_MS, entranceSequence()));
  }, [reduceMotion, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.get()}deg` }],
  }));

  return (
    <Animated.View
      testID="brand-mark"
      accessibilityRole="image"
      accessibilityLabel="Kodama"
      style={[{ width: size, height: size }, animatedStyle]}>
      <Image
        style={{ width: size, height: size }}
        contentFit="contain"
        source={
          isDay
            ? require('@/assets/brand/kodama-mark.svg')
            : require('@/assets/brand/kodama-mark-night.svg')
        }
      />
    </Animated.View>
  );
}
