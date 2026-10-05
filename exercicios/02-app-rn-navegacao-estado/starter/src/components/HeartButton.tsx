import { Pressable, StyleSheet, Text, type GestureResponderEvent } from 'react-native';
import Animated, { useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

type Props = {
  active: boolean;
  onPress: (event: GestureResponderEvent) => void;
  size?: number;
};

export default function HeartButton({ active, onPress, size = 24 }: Props) {
  const scale = useSharedValue(1);

  const handlePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    scale.value = withSequence(
      withTiming(1.35, { duration: 120 }),
      withSpring(1, { damping: 12, stiffness: 220 }),
    );
    onPress(event);
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={8}
      style={[
        styles.button,
        active
          ? {
              backgroundColor: 'rgba(255, 77, 109, 0.10)',
              borderColor: '#ff9bb0',
            }
          : {
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              borderColor: '#e8e8e8',
            },
      ]}
    >
      <Animated.View style={[styles.iconWrap, { transform: [{ scale }] }]}>
        <Text style={[styles.icon, active ? styles.activeIcon : styles.inactiveIcon]}>
          {active ? '❤' : '🤍'}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    textAlign: 'center',
    includeFontPadding: false,
    fontSize: 24,
    lineHeight: 24,
  },
  activeIcon: {
    color: '#ff4d6d',
    textShadowColor: 'rgba(255, 77, 109, 0.42)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    fontWeight: '700',
  },
  inactiveIcon: {
    color: '#9b9b9b',
    opacity: 0.9,
    fontWeight: '600',
  },
});
