// src/components/HeartButton.tsx
//
// ATIVIDADE 2 — TASK 8, opção A (Heart pop).
//
// Ao tocar: escala 1 → 1.4 → 1 (spring) + leve rotação que volta ao centro.
// Tudo roda na UI thread: os shared values são lidos dentro do worklet do
// useAnimatedStyle, então a animação não depende da JS thread estar livre.
//
// Doc: https://docs.swmansion.com/react-native-reanimated/

import { Pressable, StyleSheet, type GestureResponderEvent } from 'react-native';
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

  // Worklet: executa na UI thread a cada frame.
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  const handlePress = (e: GestureResponderEvent) => {
    e.stopPropagation(); // não abrir o detalhe ao tocar no ❤️ dentro do card

    scale.value = withSequence(
      withTiming(1.4, { duration: 120 }),
      withSpring(1, { damping: 4, stiffness: 180 })
    );
    // Ao favoritar inclina pra direita, ao desfavoritar pra esquerda.
    const tilt = active ? -15 : 15;
    rotation.value = withSequence(
      withTiming(tilt, { duration: 120 }),
      withSpring(0, { damping: 5, stiffness: 180 })
    );

    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={8}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      accessibilityState={{ selected: active }}
    >
      <Animated.Text style={[{ fontSize: size }, animatedStyle]}>
        {active ? '❤️' : '🤍'}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8 },
});
