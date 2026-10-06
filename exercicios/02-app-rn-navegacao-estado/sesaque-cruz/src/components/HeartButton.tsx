// src/components/HeartButton.tsx
//
// ATIVIDADE 2: TASK 8, opção A (Heart pop).
//
// Ao tocar, o coração escala 1 → 1.4 → 1 com spring e balança levemente.
// useSharedValue guarda os valores na UI thread; useAnimatedStyle é um worklet
// que roda lá, então a animação não depende do JS thread estar livre.
//
// Doc: https://docs.swmansion.com/react-native-reanimated/

import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/theme';

type Props = {
  active: boolean;
  onPress: () => void;
  size?: number;
};

export default function HeartButton({ active, onPress, size = 24 }: Props) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(1.4, { duration: 120 }),
      withSpring(1, { damping: 10, stiffness: 180 }),
    );
    rotation.value = withSequence(
      withTiming(active ? 12 : -12, { duration: 80 }),
      withSpring(0, { damping: 12, stiffness: 200 }),
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
      <Animated.View style={animatedStyle}>
        <Ionicons
          name={active ? 'heart' : 'heart-outline'}
          size={size}
          color={active ? colors.primary : colors.textMuted}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 6 },
});
