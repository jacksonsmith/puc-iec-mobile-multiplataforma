import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
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
    scale.value = withTiming(1.4, { duration: 120 }, () => {
      scale.value = withSpring(1);
    });

    onPress();
  };

  return (
    <Pressable
      onPress={(event) => {
        event.stopPropagation();
        handlePress();
      }}
      style={styles.button}
    >
      <Animated.View style={animatedStyle}>
        <Text style={styles.icon}>
          {active ? '❤️' : '🤍'}
        </Text>
      </Animated.View>
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