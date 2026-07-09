// src/components/HeartButton.tsx
//
// ATIVIDADE 2 — TASK 8 — Reanimated OPÇÃO A ("Heart pop")
//
// Animação roda 100% na UI thread via worklets (sem bridge, sem re-render React):
//   - useSharedValue: estado animável vivendo na UI thread
//   - useAnimatedStyle: worklet que mapeia shared values → estilo
//   - withSequence + withSpring/withTiming: pop de escala 1 → 1.4 → 1 + rotação leve
//
// Não usa a Animated API legada (que passa pela bridge/JS thread).
//
// Doc: https://docs.swmansion.com/react-native-reanimated/

import { Pressable, StyleSheet, Text } from 'react-native';
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
};

export default function HeartButton({ active, onPress }: Props) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotateZ: `${rotate.value}deg` },
    ],
  }));

  const handlePress = () => {
    // Dispara o "pop": cresce rápido (timing) e volta com mola (spring).
    scale.value = withSequence(
      withTiming(1.4, { duration: 120 }),
      withSpring(1, { damping: 6, stiffness: 200 })
    );
    // Balança levemente e retorna a 0.
    rotate.value = withSequence(
      withTiming(-12, { duration: 80 }),
      withTiming(12, { duration: 80 }),
      withSpring(0, { damping: 5 })
    );
    onPress();
  };

  return (
    <Pressable
      onPress={(e) => {
        // Evita acionar o navigate do card pai.
        e.stopPropagation?.();
        handlePress();
      }}
      hitSlop={8}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Animated.View style={animatedStyle}>
        <Text style={styles.icon}>{active ? '❤️' : '🤍'}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8 },
  icon: { fontSize: 24 },
});
