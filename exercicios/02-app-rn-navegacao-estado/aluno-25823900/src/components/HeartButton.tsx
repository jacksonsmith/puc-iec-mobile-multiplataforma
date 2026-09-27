import { Pressable } from 'react-native';
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

  const handlePress = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    scale.value = withSequence(
      withTiming(1.4, { duration: 120 }),
      withSpring(1, { damping: 5, stiffness: 220 })
    );
    rotation.value = withSequence(
      withTiming(active ? 8 : -8, { duration: 100 }),
      withSpring(0, { damping: 6, stiffness: 180 })
    );
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      accessibilityState={{ selected: active }}
      hitSlop={8}
      onPress={handlePress}
      style={{ padding: 8 }}
    >
      <Animated.Text style={[{ fontSize: 24 }, animatedStyle]}>
        {active ? '❤️' : '🤍'}
      </Animated.Text>
    </Pressable>
  );
}