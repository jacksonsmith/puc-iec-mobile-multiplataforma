import { Pressable, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from "react-native-reanimated";

type ButtonProps = {
  active: boolean;
  onPress: () => void;
};

const AnimatedButton = Animated.createAnimatedComponent(Pressable);

export default function HeartButton({ active, onPress }: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleButtonPress = () => {
    scale.value = withSequence(
      withTiming(0.7, { duration: 80 }),
      withSpring(1.3, { damping: 4, stiffness: 200 }),
      withSpring(1),
    );

    onPress();
  };

  return (
    <AnimatedButton onPress={handleButtonPress} style={animatedStyle}>
      <Text style={{ fontSize: 32 }}>{active ? "❤️" : "🤍"}</Text>
    </AnimatedButton>
  );
}
