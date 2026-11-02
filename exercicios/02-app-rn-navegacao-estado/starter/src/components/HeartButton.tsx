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
  onPress: () => void;
};

export default function HeartButton({ active, onPress }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        accessibilityState={{ selected: active }}
        onPress={(event) => {
          event.stopPropagation();
          scale.value = withSequence(
            withTiming(1.4),
            withSpring(1),
          );
          onPress();
        }}
        style={styles.button}
      >
        <Text style={styles.icon}>{active ? '❤️' : '🤍'}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  button: { padding: 8 },
  icon: { fontSize: 24 },
});