// src/components/HeartButton.tsx
//
// ATIVIDADE 2 — TASK 8 (Reanimated, opção A: heart pop)
// Toque → escala 1 → 1.4 → 1 com mola + rotação leve.
//
// Doc: https://docs.swmansion.com/react-native-reanimated/

import { type GestureResponderEvent, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type Props = { active: boolean; onPress: () => void };

export default function HeartButton({ active, onPress }: Props) {
  // Shared values: valores que a UI thread lê direto. Mudar o .value anima sem
  // re-renderizar o componente React (diferente de useState).
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  // Worklet: o plugin do Babel (react-native-reanimated/plugin) compila esta
  // função pra rodar na UI thread a cada frame, sem passar pela thread JS.
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  const handlePress = (e: GestureResponderEvent) => {
    e.stopPropagation(); // dentro do card, o toque no coração não abre o detalhe
    // sobe rápido até 1.4 (timing) e volta pra 1 com mola quicando (pouco damping)
    scale.value = withSequence(withTiming(1.4, { duration: 120 }), withSpring(1, { damping: 4 }));
    // inclina e volta balançando
    rotate.value = withSequence(withTiming(-15, { duration: 80 }), withSpring(0, { damping: 5 }));
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Remover dos favoritos' : 'Favoritar'}
      style={styles.button}
    >
      <Animated.Text style={[styles.icon, animatedStyle]}>{active ? '❤️' : '🤍'}</Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8 },
  icon: { fontSize: 24 },
});
