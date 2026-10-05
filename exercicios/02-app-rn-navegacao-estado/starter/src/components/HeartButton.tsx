import type { GestureResponderEvent } from 'react-native';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
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

  const handlePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    scale.value = withSequence(
      withSpring(1.4, { damping: 8, stiffness: 250 }),
      withSpring(1, { damping: 8, stiffness: 250 }),
    );
    onPress();
  };

  return (
    <Pressable
      accessibilityLabel={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      accessibilityRole="button"
      onPress={handlePress}
      style={styles.button}
    >
      <Animated.View style={animatedStyle}>
        <Text style={styles.icon}>{active ? '❤️' : '🤍'}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8 },
  icon: { fontSize: 24 },
});