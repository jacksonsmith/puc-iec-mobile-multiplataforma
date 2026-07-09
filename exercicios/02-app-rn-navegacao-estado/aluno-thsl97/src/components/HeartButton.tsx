import { GestureResponderEvent, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export function HeartButton({
  active,
  onPress,
}: {
  active: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = (e: GestureResponderEvent) => {
    e.stopPropagation();
    scale.value = withSequence(
      withTiming(1.4, { duration: 120 }),
      withSpring(1, { damping: 4 }),
    );
    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.Text style={[{ fontSize: 24 }, style]}>
        {active ? "❤️" : "🤍"}
      </Animated.Text>
    </Pressable>
  );
}
