// src/components/HeartButton.tsx
//
// ATIVIDADE 2 — TASK 8, Opção A: Heart pop (Reanimated)
//
// Escala 1 → 1.4 → 1 com mola + "chacoalhada" de rotação. Os valores vivem
// em shared values e o estilo é calculado num worklet (useAnimatedStyle),
// então a animação roda na UI thread — não trava mesmo se o JS estiver ocupado.
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
  const rotation = useSharedValue(0); // graus

  // Worklet: o plugin do Babel marca esse callback pra rodar na UI thread.
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  const handlePress = (e: GestureResponderEvent) => {
    // Card pai também é Pressable (navega pro detalhe) → não propagar.
    e.stopPropagation();

    // Atribuir em .value só agenda a animação; quem interpola é a UI thread.
    scale.value = withSequence(
      withTiming(1.4, { duration: 120 }),
      withSpring(1, { damping: 4, stiffness: 180 }),
    );
    rotation.value = withSequence(
      withTiming(-15, { duration: 60 }),
      withTiming(15, { duration: 120 }),
      withSpring(0, { damping: 5 }),
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
      <Animated.Text style={[{ fontSize: size }, animatedStyle]}>{active ? '❤️' : '🤍'}</Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8 },
});
