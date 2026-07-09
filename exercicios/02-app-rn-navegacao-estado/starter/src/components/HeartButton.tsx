// src/components/HeartButton.tsx
//
// ATIVIDADE 2 — TASK 8: botão de favorito com animação Reanimated

import { Pressable } from 'react-native';
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

  function handlePress() {
    scale.value = withSequence(withSpring(1.4), withSpring(1));
    onPress();
  }

  return (
    <Pressable onPress={handlePress} style={{ padding: 8 }}>
      <Animated.Text style={[{ fontSize: 24 }, animatedStyle]}>
        {active ? '❤️' : '🤍'}
      </Animated.Text>
    </Pressable>
  );
}
