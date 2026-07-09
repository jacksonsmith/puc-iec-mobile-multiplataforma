import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

type Props = {
  active?: boolean;
  onPress?: () => void;
};

const AnimatedText = Animated.Text;

export default function HeartButton({ active = false, onPress }: Props) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const aStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const handlePress = () => {
    // trigger pop animation sequence on press
    scale.value = withSequence(withTiming(1.4, { duration: 120 }), withSpring(1));
    rotate.value = withSequence(withTiming(12, { duration: 120 }), withSpring(0));
    onPress?.();
  };

  return (
    <Pressable onPress={handlePress} style={styles.button} accessibilityLabel="favorite">
      <AnimatedText style={[styles.icon, aStyle, { color: active ? '#e0245e' : '#999' }]}>
        {active ? '❤' : '♡'}
      </AnimatedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8 },
  icon: { fontSize: 24, lineHeight: 24 },
});
