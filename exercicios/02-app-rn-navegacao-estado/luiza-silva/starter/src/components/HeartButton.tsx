// src/components/HeartButton.tsx
//
// TASK 8 — HeartButton com animação via Reanimated

import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
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

  const handlePress = (e: any) => {
    e.stopPropagation();
    scale.value = withSequence(
      withSpring(1.4, { damping: 4 }),
      withSpring(1, { damping: 6 }),
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
  button: { padding: 8 },
  icon: { fontSize: 24 },
});