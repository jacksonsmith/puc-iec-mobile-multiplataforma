// src/components/HeartButton.tsx
//
// ATIVIDADE 2 — TASK 8 (opção A: Heart pop com Reanimated)
//
// Ao tocar, o coração cresce até 1.4x (withTiming) e volta pra 1x com
// efeito de mola (withSpring), encadeados por withSequence.
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
};

export default function HeartButton({ active, onPress }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = (e: GestureResponderEvent) => {
    // Evita que o toque no coração dispare o onPress do card (navegação)
    e.stopPropagation();
    scale.value = withSequence(withTiming(1.4, { duration: 120 }), withSpring(1));
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={styles.button}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Animated.Text style={[styles.icon, animatedStyle]}>{active ? '❤️' : '🤍'}</Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8 },
  icon: { fontSize: 24 },
});
