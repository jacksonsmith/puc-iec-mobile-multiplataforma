import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { Film } from '@/domain/film';

import { Glass } from './glass';
import { Text } from './text';
import { useBrandTokens } from './use-brand-tokens';

export const FILM_CARD_WIDTH = 132;

const PRESSED_SCALE = 0.97;
const PRESS_DURATION_MS = 120;

type FilmCardProps = {
  film: Film;
  isFavorite: boolean;
  onPress: () => void;
  width?: number;
  subtitle?: string;
  testID?: string;
};

export function FilmCard({
  film,
  isFavorite,
  onPress,
  width = FILM_CARD_WIDTH,
  subtitle,
  testID,
}: FilmCardProps) {
  const tokens = useBrandTokens();
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const [hasImageError, setHasImageError] = useState(false);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  function animateScale(toValue: number) {
    if (!reduceMotion) scale.set(withTiming(toValue, { duration: PRESS_DURATION_MS }));
  }

  return (
    <Pressable
      testID={testID ?? `item-card-${film.id}`}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? `${film.title}, favorito` : film.title}
      style={{ width }}
      onPress={onPress}
      onPressIn={() => animateScale(PRESSED_SCALE)}
      onPressOut={() => animateScale(1)}>
      <Animated.View style={pressStyle}>
        <View className="rounded-md" style={{ boxShadow: tokens.shadow('shadow-poster') }}>
          <View className="aspect-[2/3] items-center justify-center overflow-hidden rounded-md bg-canvas-raised">
            {hasImageError ? (
              <Text variant="display" tone="sky">
                {film.originalTitle.charAt(0)}
              </Text>
            ) : (
              <Image
                style={StyleSheet.absoluteFill}
                source={{ uri: film.imageUrl }}
                contentFit="cover"
                transition={200}
                onError={() => setHasImageError(true)}
              />
            )}
            {isFavorite && (
              <Glass
                testID={`item-card-fav-${film.id}`}
                variant="scrim"
                blur="sm"
                className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full">
                <SymbolView
                  name={{ ios: 'star.fill', android: 'star', web: 'star' }}
                  size={18}
                  tintColor={tokens.color('lamp-on-image')}
                />
              </Glass>
            )}
          </View>
        </View>
      </Animated.View>
      <Text
        testID={`item-card-title-${film.id}`}
        variant="card-title"
        numberOfLines={2}
        className="mt-2">
        {film.title}
      </Text>
      {subtitle && (
        <Text variant="meta" tone="muted">
          {subtitle}
        </Text>
      )}
    </Pressable>
  );
}
