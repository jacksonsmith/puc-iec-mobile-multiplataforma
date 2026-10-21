// src/components/HeartButton.tsx

import { Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useFavoritesStore } from '@/store/favoritesStore';

type HeartButtonProps = {
  id: number;
};

export function HeartButton({ id }: HeartButtonProps) {
  const toggle = useFavoritesStore((state) => state.toggle);
  const isFavorite = useFavoritesStore((state) =>
    state.isFavorite(id)
  );

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    toggle(id);

    scale.value = withSequence(
      withTiming(1.4, { duration: 150 }),
      withSpring(1)
    );
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={
        isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
      }
    >
      <Animated.View style={animatedStyle}>
        <Text style={{ fontSize: 28 }}>
          {isFavorite ? '❤️' : '🤍'}
        </Text>
      </Animated.View>
    </Pressable>
  );
}