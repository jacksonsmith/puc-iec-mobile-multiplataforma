import { useEffect } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  active: boolean;
  onPress: (event: GestureResponderEvent) => void;
};

export default function HeartButton({ active, onPress }: Props) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (active) {
      scale.value = withSequence(withTiming(1.4, { duration: 120 }), withSpring(1));
    } else {
      scale.value = withTiming(1, { duration: 120 });
    }
  }, [active, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={onPress} style={styles.button} accessibilityRole="button">
        <Text style={[styles.icon, active && styles.iconActive]}>{active ? '♥' : '♡'}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: '#555',
    fontSize: 30,
    lineHeight: 34,
  },
  iconActive: {
    color: '#e11d48',
  },
});
