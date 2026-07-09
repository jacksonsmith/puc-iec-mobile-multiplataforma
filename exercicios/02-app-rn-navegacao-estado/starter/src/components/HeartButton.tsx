// src/components/HeartButton.tsx
//
// ATIVIDADE 2 — TASK 8 (animação Reanimated)
//
// Animação: heart pop — escala de 1 → 1.4 → 1 com withSpring ao favoritar.
// Roda na UI thread via worklet, independente da JS thread.
//
// Doc: https://docs.swmansion.com/react-native-reanimated/

import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
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

  const handlePress = () => {
    // Dispara animação de pop na UI thread via worklet
    scale.value = withSpring(1.4, { damping: 4, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 6, stiffness: 200 });
    });
    onPress();
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Animated.Text style={[styles.icon, animatedStyle]}>
        {active ? '❤️' : '🤍'}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { padding: 8 },
  icon: { fontSize: 24 },
});