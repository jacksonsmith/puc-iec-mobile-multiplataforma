// src/components/HeartButton.tsx
//
// ATIVIDADE 2 — TASK 8 (Reanimated, Opção A: Heart pop)
//
// Ao tocar: escala 1 -> 1.4 (timing) -> 1 (spring com overshoot) + rotação leve.
// Um único SharedValue (`progress`) comanda escala e rotação, e tudo é
// calculado dentro de worklets na UI thread — sem passar pela bridge JS.

import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  interpolate,
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

// Worklet stand-alone: a diretiva 'worklet' é OBRIGATÓRIA em funções
// fora de useAnimatedStyle/useDerivedValue que rodam na UI thread.
function heartTransform(progress: number) {
  'worklet';
  return [
    { scale: interpolate(progress, [0, 1], [1, 1.4]) },
    { rotate: `${interpolate(progress, [0, 1], [0, -15])}deg` },
  ];
}

export default function HeartButton({ active, onPress }: Props) {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: heartTransform(progress.value),
  }));

  const handlePress = () => {
    // 0 -> 1 rápido, depois 1 -> 0 com mola (damping baixo = "quica").
    progress.value = withSequence(
      withTiming(1, { duration: 120 }),
      withSpring(0, { damping: 4, stiffness: 200 })
    );
    // onPress roda na JS thread (handler do Pressable), então não precisa runOnJS.
    onPress();
  };

  return (
    <Pressable
      onPress={(e) => {
        // Evita que o toque "vaze" pro card pai (navegação), principalmente na web.
        e.stopPropagation();
        handlePress();
      }}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Animated.Text style={[styles.heart, animatedStyle]}>{active ? '❤️' : '🤍'}</Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heart: { fontSize: 24 },
});
