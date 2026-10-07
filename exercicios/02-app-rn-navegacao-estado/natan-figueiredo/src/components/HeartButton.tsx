// src/components/HeartButton.tsx
//
// ATIVIDADE 2 — TASK 8 (Reanimated — Opção A: heart pop)
//
// Tap no ❤️ → escala 1 → 1.4 → 1 (spring) + rotação leve que volta ao centro.
//
// Onde roda cada parte:
// - handlePress roda na JS thread, mas só ATRIBUI animações aos shared values
//   (withSequence/withTiming/withSpring são descritores, não loops em JS).
// - O callback de useAnimatedStyle é um worklet (o plugin Babel do Reanimated
//   converte automaticamente) e é executado na UI thread a cada frame →
//   a animação não trava mesmo se a JS thread estiver ocupada.
//
// Doc: https://docs.swmansion.com/react-native-reanimated/

import { GestureResponderEvent, Pressable, StyleSheet } from 'react-native';
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  const handlePress = (e: GestureResponderEvent) => {
    // Card pai também é Pressable (navega pro detalhe) — não propagar o toque.
    e.stopPropagation();

    scale.value = withSequence(
      withTiming(1.4, { duration: 120 }),
      withSpring(1, { damping: 4, stiffness: 180 }),
    );
    // inclina pro lado oposto ao favoritar/desfavoritar, depois volta com spring
    rotation.value = withSequence(
      withTiming(active ? 12 : -12, { duration: 120 }),
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
      <Animated.Text style={[{ fontSize: size }, animatedStyle]}>
        {active ? '❤️' : '🤍'}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8 },
});
