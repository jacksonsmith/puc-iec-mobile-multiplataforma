// src/components/SwipeableCard.tsx
//
// ATIVIDADE 2 — TASK 8, opção B (Card swipe) — bônus de 2ª opção Reanimated.
//
// Arrastar o card pra direita = favoritar; pra esquerda = desfavoritar.
// Passou do threshold → dispara a ação (runOnJS volta pro JS thread) e o card
// volta com withSpring. Tudo que mexe na posição roda na UI thread (worklets).
//
// Nota: usa Gesture.Pan() do react-native-gesture-handler v2, que é o substituto
// do useAnimatedGestureHandler (deprecated no Reanimated 3 e removido no 4).

import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const THRESHOLD = 90;

type Props = {
  children: ReactNode;
  onSwipeRight: () => void; // favoritar
  onSwipeLeft: () => void; // desfavoritar
};

export default function SwipeableCard({ children, onSwipeRight, onSwipeLeft }: Props) {
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .activeOffsetX([-15, 15]) // só ativa em arrasto horizontal (não briga com o scroll da lista)
    .failOffsetY([-10, 10])
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (e.translationX > THRESHOLD) {
        runOnJS(onSwipeRight)();
      } else if (e.translationX < -THRESHOLD) {
        runOnJS(onSwipeLeft)();
      }
      translateX.value = withSpring(0, { damping: 15 });
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const favHintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  const dropHintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-THRESHOLD, 0], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <View>
      <View style={styles.hints} pointerEvents="none">
        <Animated.Text style={[styles.hint, favHintStyle]}>❤️ Favoritar</Animated.Text>
        <Animated.Text style={[styles.hint, dropHintStyle]}>Remover 🤍</Animated.Text>
      </View>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.card, cardStyle]}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff' },
  hints: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#f3f3f3',
  },
  hint: { fontSize: 14, fontWeight: '600', color: '#444' },
});
