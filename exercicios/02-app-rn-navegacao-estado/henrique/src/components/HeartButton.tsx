// src/components/HeartButton.tsx
//
// ATIVIDADE 2 — TASK 8 (Reanimated não-trivial: Heart Pop animation)

import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
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

  const handlePress = () => {
    // Worklet Reanimated rodando na UI thread: escala 1 → 1.4 → 1 com spring
    scale.value = withSequence(
      withTiming(1.4, { duration: 120 }),
      withSpring(1, { damping: 4, stiffness: 200 })
    );
    onPress();
  };

  return (
    <Pressable onPress={handlePress} style={styles.button}>
      <Animated.Text style={[styles.icon, animatedStyle]}>
        {active ? '❤️' : '🤍'}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  icon: {
    fontSize: 24,
  },
});
