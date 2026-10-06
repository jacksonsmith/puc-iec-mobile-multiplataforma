// src/components/HeartButton.tsx
//
// ATIVIDADE 2 — TASK 8, opção A (Heart pop) com Reanimated.
//
// Ao tocar, o coração escala 1 → 1.4 → 1 com spring.
// Roda como worklet: useSharedValue + useAnimatedStyle, na UI thread.
// Doc: https://docs.swmansion.com/react-native-reanimated/

import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

type Props = {
  active: boolean;
  onPress: () => void;
};

export default function HeartButton({ active, onPress }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = (e: { stopPropagation: () => void }) => {
    e.stopPropagation(); // não dispara o onPress do card pai
    scale.value = withSequence(withSpring(1.4), withSpring(1));
    onPress();
  };

  return (
    <Pressable onPress={handlePress} style={styles.hit} hitSlop={8}>
      <Animated.Text style={[styles.icon, animatedStyle]}>{active ? '❤️' : '🤍'}</Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: { padding: 8 },
  icon: { fontSize: 24 },
});
