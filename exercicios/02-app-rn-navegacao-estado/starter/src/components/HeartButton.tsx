import { Pressable, StyleProp, ViewStyle } from 'react-native';
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
  style?: StyleProp<ViewStyle>;
};

export default function HeartButton({ active, onPress, style }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(1.4, { duration: 120 }),
      withSpring(1, { damping: 4 })
    );
    onPress();
  };

  return (
    <Pressable
      onPress={(e) => {
        e.stopPropagation();
        handlePress();
      }}
      style={style}
    >
      <Animated.Text style={[{ fontSize: 24 }, animatedStyle]}>
        {active ? '❤️' : '🤍'}
      </Animated.Text>
    </Pressable>
  );
}
