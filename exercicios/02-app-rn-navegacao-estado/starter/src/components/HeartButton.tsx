import { Pressable, StyleSheet, Text, type GestureResponderEvent } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type HeartButtonProps = {
  active: boolean;
  onPress?: () => void;
  size?: number;
};

export default function HeartButton({ active, onPress, size = 24 }: HeartButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = (event?: GestureResponderEvent) => {
    event?.stopPropagation();
    scale.value = withSequence(withTiming(1.4, { duration: 120 }), withSpring(1, { damping: 10, stiffness: 220 }));
    onPress?.();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      onPress={handlePress}
      hitSlop={10}
      style={styles.button}
    >
      <Animated.View style={animatedStyle}>
        <Text style={[styles.icon, { fontSize: size }]}>{active ? "❤️" : "🤍"}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    lineHeight: 28,
  },
});
