// src/components/HeartButton.tsx
//
// ATIVIDADE 2 — TASK 8 (opção A: Heart pop)
//
// Animação: ao pressionar, escala vai a 1.4 com withTiming e volta a 1
// com withSpring — efeito de "pop" típico de botão de favorito.
//
// Doc Reanimated:
//   https://docs.swmansion.com/react-native-reanimated/docs/api/sharedValue
//   https://docs.swmansion.com/react-native-reanimated/docs/api/animations/withSequence

import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

type Props = {
  active: boolean;
  onPress: () => void;
  size?: number;
};

export default function HeartButton({ active, onPress, size = 24 }: Props) {
  // valor compartilhado entre JS thread e UI thread
  const scale = useSharedValue(1);

  // estilo derivado do shared value (roda na UI thread, sem re-render)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    // A — Heart pop: comSequence(comTiming(1.4), comSpring(1))
    scale.value = withSequence(
      withTiming(1.4, { duration: 120 }),
      withSpring(1, { damping: 6, stiffness: 180 }),
    );
    onPress();
  };

  return (
    <Pressable onPress={handlePress} hitSlop={8} style={styles.btn} accessibilityRole="button" accessibilityLabel={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
      <Animated.Text
        style={[
          styles.heart,
          { fontSize: size },
          active ? styles.heartActive : styles.heartInactive,
          animatedStyle,
        ]}
      >
        ♥
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 8 },
  heart: { textAlign: 'center' },
  heartInactive: { color: '#aaa' },
  heartActive: { color: 'red' },
});