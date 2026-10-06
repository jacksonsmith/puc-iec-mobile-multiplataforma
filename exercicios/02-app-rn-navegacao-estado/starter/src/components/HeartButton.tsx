import { Pressable, StyleSheet } from 'react-native';
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
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(withTiming(1.4, { duration: 120 }), withSpring(1, { damping: 5 }));
    onPress();
  };

  return (
    <Pressable
      accessibilityLabel={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      accessibilityRole="button"
      onPress={(event) => {
        event.stopPropagation();
        handlePress();
      }}
      style={styles.button}
    >
      <Animated.Text style={[styles.icon, animatedStyle]}>{active ? '❤️' : '🤍'}</Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8 },
  icon: { fontSize: 24 },
});