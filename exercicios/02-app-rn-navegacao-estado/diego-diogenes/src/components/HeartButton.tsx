// src/components/HeartButton.tsx
//
// ATIVIDADE 2 — TASK 8 (Opção A — Heart pop)
//
// Animação roda na UI thread: useSharedValue + useAnimatedStyle + worklets
// do Reanimated. No tap, o coração cresce (spring) e gira levemente.

import type { GestureResponderEvent } from 'react-native';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  active: boolean;
  onPress: () => void;
  size?: number;
};

export default function HeartButton({ active, onPress, size = 24 }: Props) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  const handlePress = (event: GestureResponderEvent) => {
    // O card inteiro é pressable (navega pro detalhe). O coração não deve
    // disparar a navegação.
    event.stopPropagation();

    scale.value = withSequence(
      withTiming(1.4, { duration: 120 }),
      withSpring(1, { damping: 4, stiffness: 180 })
    );
    rotation.value = withSequence(
      withTiming(-12, { duration: 120 }),
      withSpring(0, { damping: 5, stiffness: 180 })
    );

    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      accessibilityState={{ selected: active }}
      style={styles.pressable}
    >
      <Animated.Text style={[{ fontSize: size }, animatedStyle]}>
        {active ? '❤️' : '🤍'}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: { padding: 4 },
});
