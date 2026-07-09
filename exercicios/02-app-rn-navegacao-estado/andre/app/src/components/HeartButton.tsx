import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { GestureResponderEvent } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  active: boolean;
  onPress: () => void;
};

export default function HeartButton({ active, onPress }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    scale.value = withSequence(
      withTiming(1.4, { duration: 120 }),
      withSpring(1),
    );
    onPress();
  };

  return (
    <AnimatedPressable onPress={handlePress} style={[styles.button, animatedStyle]}>
      <Text style={[styles.icon, active && styles.active]}>
        {active ? '❤️' : '🤍'}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  active: {
    textShadowColor: '#ff6b81',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
});
