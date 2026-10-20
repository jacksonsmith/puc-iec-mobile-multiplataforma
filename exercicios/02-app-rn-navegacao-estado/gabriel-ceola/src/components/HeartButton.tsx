// src/components/HeartButton.tsx
//
// ATIVIDADE 2 — TASK 8 (Reanimated, opção A: heart pop)
//
// Tocar no ❤️ → escala 1 → 1.4 → 1.0 (spring) + rotação leve.
//
// useSharedValue guarda o valor animado fora do estado React (não causa
// re-render). O callback do useAnimatedStyle vira um worklet (plugin do
// babel) e roda na UI thread: a animação continua fluida mesmo se a
// thread JS estiver ocupada.
//
// Doc: https://docs.swmansion.com/react-native-reanimated/

import { GestureResponderEvent, Pressable, StyleSheet, Text } from 'react-native';
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
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  const handlePress = (e: GestureResponderEvent) => {
    // Não deixa o toque "vazar" pro card (que navegaria pro detalhe).
    e.stopPropagation();
    // Sobe rápido (timing) e volta com mola (spring) — o "pop".
    scale.value = withSequence(withTiming(1.4, { duration: 120 }), withSpring(1));
    rotation.value = withSequence(withTiming(-15, { duration: 120 }), withSpring(0));
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={8}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Animated.View style={animatedStyle}>
        <Text style={styles.icon}>{active ? '❤️' : '🤍'}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8 },
  icon: { fontSize: 24 },
});
