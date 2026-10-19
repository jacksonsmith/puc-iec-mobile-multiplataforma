// src/components/HeartButton.tsx
//
// ATIVIDADE 2 — TASK 8, opção A (Heart pop)
//
// Animação roda na UI thread via worklets do Reanimated 3:
// - useSharedValue guarda scale/rotate sem passar pelo JS thread
// - useAnimatedStyle (worklet) lê os valores e produz o estilo
// - withSequence + withTiming + withSpring compõem o "pop"

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
};

export default function HeartButton({ active, onPress }: Props) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  const handlePress = (e?: { stopPropagation?: () => void }) => {
    // Evita disparar o onPress do card pai (navegação pro detalhe)
    e?.stopPropagation?.();

    scale.value = withSequence(withTiming(1.4, { duration: 120 }), withSpring(1, { damping: 4 }));
    rotate.value = withSequence(
      withTiming(-15, { duration: 80 }),
      withTiming(15, { duration: 80 }),
      withSpring(0, { damping: 6 })
    );

    onPress();
  };

  return (
    <Pressable onPress={handlePress} style={styles.button} hitSlop={8}>
      <Animated.Text style={[styles.icon, animatedStyle]}>{active ? '❤️' : '🤍'}</Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8 },
  icon: { fontSize: 24 },
});
