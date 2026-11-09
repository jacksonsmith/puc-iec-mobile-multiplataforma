import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Film } from '@/domain/film';

import { Glass } from './glass';
import { Text } from './text';
import { useBrandTokens } from './use-brand-tokens';

const FADE_START = 0.55;
const TRANSPARENT_ALPHA = '00';

type FilmBannerProps = {
  film: Film;
  onBack: () => void;
};

export function FilmBanner({ film, onBack }: FilmBannerProps) {
  const tokens = useBrandTokens();
  const insets = useSafeAreaInsets();
  const [hasImageError, setHasImageError] = useState(false);
  const canvas = tokens.color('canvas');

  return (
    <View
      className="aspect-video w-full items-center justify-center bg-canvas-raised"
      style={{ boxShadow: tokens.shadow('shadow-poster') }}>
      {hasImageError ? (
        <Text variant="display" tone="sky">
          {film.originalTitle.charAt(0)}
        </Text>
      ) : (
        <Image
          style={StyleSheet.absoluteFill}
          source={{ uri: film.bannerUrl }}
          contentFit="cover"
          transition={200}
          accessibilityLabel={`Banner de ${film.title}`}
          onError={() => setHasImageError(true)}
        />
      )}
      <LinearGradient
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        colors={[`${canvas}${TRANSPARENT_ALPHA}`, canvas]}
        locations={[FADE_START, 1]}
      />
      <Pressable
        testID="detail-back-button"
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        className="absolute left-4"
        style={{ top: insets.top + 8 }}
        onPress={onBack}>
        <Glass
          variant="scrim"
          blur="sm"
          className="h-12 w-12 items-center justify-center rounded-full">
          <SymbolView
            name={{ ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' }}
            size={24}
            tintColor={tokens.color('ink-on-image')}
          />
        </Glass>
      </Pressable>
    </View>
  );
}
